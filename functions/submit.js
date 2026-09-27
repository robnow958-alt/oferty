export async function onRequestPost(context) {
  try {
    // Odczytanie danych przesłanych z formularza HTML
    const formData = await context.request.formData();
    
    const name = formData.get("name");
    const email = formData.get("email");
    const pkg = formData.get("package");
    const details = formData.get("details");

    // Rejestracja odebrania zamówienia w dzienniku Cloudflare Logs
    console.log("--- NOWE ZAMÓWIENIE (CLOUDFLARE) ---");
    console.log(`Imię / Firma: ${name}`);
    console.log(`E-mail klienta: ${email}`);
    console.log(`Wariant: ${pkg}`);
    console.log(`Szczegóły: ${details}`);
    console.log("-------------------------------------");

    // Zwrócenie odpowiedzi sukcesu do przeglądarki
    return new Response(
      JSON.stringify({ message: "Zamówienie zostało odebrane przez Cloudflare." }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Błąd przetwarzania: " + err.message }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
