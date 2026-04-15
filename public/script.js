async function sendtoDB() {
    const input_text = document.getElementById("inputTest").value;

    const respone = await fetch('/input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_text })
    });

    const data = await response.json();

    console.log(data)
}