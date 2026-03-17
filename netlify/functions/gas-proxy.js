// netlify/functions/gas-proxy.js
// Proxy per Google Apps Script — evita CORS dal browser

const GAS_URL = "https://script.google.com/macros/s/AKfycbw2hXGUfOsOWfVwXrNnEIR8RE4B22ZO33nrSeV64AtEQsS-EphJ7gaQAQyDW4jzkj3L/exec";

exports.handler = async function(event, context) {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: event.body,
      redirect: "follow",
    });

    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: text,
    };
  } catch (err) {
    console.error("gas-proxy error:", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
};
