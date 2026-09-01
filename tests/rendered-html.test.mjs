import assert from "node:assert/strict";
import test from "node:test";

test("renders the Semillero Consonante title", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), /<title>Semillero Consonante<\/title>/i);
});

test("renders the complete Relato en Punto podcast collection", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("podcast-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  const html = await response.text();
  assert.match(html, /Relato en Punto/);
  assert.match(html, /eFNWbQaGozg/);
  assert.match(html, /UsqSNkHy4KM/);
  assert.match(html, /8H8WuysX8LI/);
  assert.match(html, /soHfFq57KJM/);
  assert.match(html, /open\.spotify\.com\/embed\/show\/6bLNlEtrplQ8FBqC8rXs2W/);
});

test("renders all Semillero Consonante social links", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("social-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  const html = await response.text();
  assert.match(html, /instagram\.com\/semillero\.consonante/);
  assert.match(html, /facebook\.com\/semillero\.consonante/);
  assert.match(html, /tiktok\.com\/@semillero\.consonante/);
  assert.match(html, /youtube\.com\/@SemilleroConsonante/);
  assert.match(html, /open\.spotify\.com\/show\/6bLNlEtrplQ8FBqC8rXs2W/);
  assert.match(html, /soundcloud\.com\/semillero-consonante/);
});
