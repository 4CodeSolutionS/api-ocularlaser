import { ReceiveEventOfPaymentsWebhook } from "@/usecases/payments/webhooks/receive-events-payments-webhook"

export async function makeReceiveEventsPaymentsWebHook(): Promise<ReceiveEventOfPaymentsWebhook> {
    const receiveEventOfPaymentsWebhook = new ReceiveEventOfPaymentsWebhook()

    return receiveEventOfPaymentsWebhook
}