async function sendData() {
    const input_text = document.getElementById("inputTest").value;

    const response = await fetch('/input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_text })
    });

    const data = await response.json();

    console.log(data)
}

async function sendToDatabase() {
    const input_to_db = document.getElementById("inputDB").value;
}