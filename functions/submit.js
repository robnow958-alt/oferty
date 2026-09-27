export async function onRequestPost(context) {
  try {
    // 1. Odbieramy dane przesłane z formularza na stronie
    const formData = await context.request.formData();
    const name = formData.get("name") || "Brak danych";
    const email = formData.get("email") || "Brak danych";
    const pkg = formData.get("package") || "Brak danych";
    const details = formData.get("details") || "Brak danych";

    // 2. Pobieramy klucz API z ustawień Cloudflare
    const apiKey = context.env.RESEND_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Brak skonfigurowanego klucza RESEND_API_KEY w Cloudflare." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Wysyłamy wiadomość na Twój adres e-mail przez darmowe API Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Formularz Oferty <onboarding@resend.dev>",
        to: ["oferty@unprinted.pl"], // <--- TUTAJ WPISZ SWÓJ E-MAIL
        subject: `Nowe zamówienie: ${pkg} - ${name}`,
        html: `
          <h2>Nowe zgłoszenie z formularza</h2>
          <p><strong>Imię i nazwisko / Firma:</strong> ${name}</p>
          <p><strong>Adres E-mail klienta:</strong> ${email}</p>
          <p><strong>Wybrany wariant:</strong> ${pkg}</p>
          <p><strong>Szczegóły / Zakres:</strong></p>
          <blockquote style="background: #f4f4f4; padding: 10px; border-left: 4px solid #ccc;">
            ${details.replace(/\n/g, '<br>')}
          </blockquote>
        `,
      }),
    });

    if (res.ok) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      const errText = await res.text();
      return new Response(JSON.stringify({ error: errText }), { status: 500 });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
