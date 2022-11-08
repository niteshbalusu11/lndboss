const flatten = arr => [].concat(...arr);

/** Derive pending forwards frrom a list of pending payments
  {
    channels: [{
      id: <Channel Id String>
      partner_public_key: <Peer Public Key Hex String>
      pending_payments: [{
        id: <Payment Preimage Hash Hex String>
        [in_channel]: <Forward Inbound From Channel Id String>
        [in_payment]: <Payment Index on Inbound Channel Number>
        [is_forward]: <Payment is a Forward Bool>
        is_outgoing: <Payment Is Outgoing Bool>
        [out_channel]: <Forward Outbound To Channel Id String>
        [out_payment]: <Payment Index on Outbound Channel Number>
        [payment]: <Payment Attempt Id Number>
        timeout: <Chain Height Expiration Number>
        tokens: <Payment Tokens Number>
      }]
    }]
  }
  @returns
  {
    forwarding: [{
      fee: <Routing Fee Tokens Number>
      in_peer: <Forwarding From Peer Public Key Hex String>
      out_peer: <Forwarding to Peer Public Key Hex String>
      payment: <Forwarding Payment Hash Hex String>
      timeout: <Chain Height Expiration Number>
      tokens: <Forwarding Tokens Amount Number>
    }]
    sending: [{
      out_channel: <Sending Out Channel Id String>
      out_peer: <Sending Out Peer Public Key Hex String>
      timeout: <Sending Timeout Block Height Number>
      tokens: <Sending Tokens Amount Number>
    }]
  }
*/
const pendingPayments = ({ channels }) => {
  // Collect all the outbound type HTLCs
  const sending = flatten(
    channels.map(channel => {
      return (channel.pending_payments || [])
        .filter(n => !n.is_forward && !!n.is_outgoing)
        .map(payment => ({
          out_channel: channel.id,
          out_peer: channel.partner_public_key,
          timeout: payment.timeout,
          tokens: payment.tokens,
        }));
    })
  );

  // Collect all the forwarding type HTLCs
  const forwards = flatten(
    channels.map(channel => {
      return (channel.pending_payments || [])
        .filter(n => !!n.is_forward)
        .filter(n => !!n.in_channel || !!n.out_channel)
        .filter(n => !!n.in_payment || !!n.out_payment)
        .map(payment => ({
          channel: channel.id,
          id: payment.id,
          in_channel: payment.in_channel,
          in_payment: payment.in_payment,
          is_outgoing: payment.is_outgoing,
          payment: payment.payment,
          timeout: payment.timeout,
          tokens: payment.tokens,
        }));
    })
  );

  // Outbound forwarding HTLCs
  const outbound = forwards
    // Outbound forwards have inbound channels and inbound payment indexes
    .filter(n => !!n.in_channel && !!n.in_payment && !!n.is_outgoing)
    // Only evaluate forwards where the inbound channel exists in channels
    .filter(htlc => channels.find(channel => channel.id === htlc.in_channel))
    // Only evaluate forwards wherre the inbound payment exists in the payments
    .filter(htlc => forwards.find(n => n.payment === htlc.in_payment));

  // HTLCs that are being routed
  const forwarding = outbound.map(htlc => {
    const inboundChannel = channels.find(n => n.id === htlc.in_channel);
    const inboundPayment = forwards.find(n => n.payment === htlc.in_payment);
    const outboundChannel = channels.find(n => n.id === htlc.channel);

    return {
      fee: inboundPayment.tokens - htlc.tokens,
      in_peer: inboundChannel.partner_public_key,
      out_peer: outboundChannel.partner_public_key,
      payment: htlc.id,
      timeout: inboundPayment.timeout,
      tokens: htlc.tokens,
    };
  });

  return { forwarding, sending };
};

export default pendingPayments;
