import { cookies, headers } from "next/headers"
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import Stripe from "stripe"

import { env } from "@/env.mjs"
import { Database } from "@/types/db"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string
  const supabase = createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  })

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    // Update the user stripe into in our database.
    // Since this is the initial subscription, we need to update
    // the subscription id and customer id.

    await supabase
      .from("users")
      .update({
        stripe_customer_id: subscription.id,
        stripe_subscription_id: subscription.customer as string,
        stripe_price_id: subscription.items.data[0].price.id,
        stripe_current_period_end: new Date(
          subscription.current_period_end * 1000
        ).toISOString(),
      })
      .eq("id", session?.metadata?.userId)
  }

  if (event.type === "invoice.payment_succeeded") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    // Update the price id and set the new period end.
    await supabase
      .from("users")
      .update({
        stripe_price_id: subscription.items.data[0].price.id,
        stripe_current_period_end: new Date(
          subscription.current_period_end * 1000
        ).toISOString(),
      })
      .eq("stripeSubscriptionId", subscription.id)
  }

  return new Response(null, { status: 200 })
}
