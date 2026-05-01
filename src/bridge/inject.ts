function escapeJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

export function inject(baseHtml: string, script: string, payload?: unknown) {
  const dataScript = payload === undefined
    ? ''
    : `window.__STITCH_DATA__=${escapeJson(payload)};`

  return baseHtml.replace(
    '</body>',
    `<script>(function(){${dataScript}${script}})();</script></body>`,
  )
}
