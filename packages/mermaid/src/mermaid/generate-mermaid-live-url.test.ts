import { createSubstreamFixture } from "@substreams/testutils";
import { assert, expect, test } from "vitest";
import { generateMermaidLiveUrl } from "./generate-mermaid-live-url.js";

const uniswap = createSubstreamFixture("uniswap-v3");

test("should generate a mermaid live url", () => {
  assert(uniswap.modules);

  expect(generateMermaidLiveUrl(uniswap.modules.modules)).toMatchInlineSnapshot(
    '"https://mermaid.live/edit#pako:eNqtV8uOmzAU/ZXI6xmkdkmlLtr5g3Y3IMsFp7ECmLEveWg0/14nToKxr8FtWXLvOcf35QfvpJI1Jzn5rVi/2/x8+VJ0m03LetpL2WhaKc6A16/Gkofm8orW24zDjis+tBmce54dPmffGlntX7UcVMXzOKLcPD9/DXWtLEjFvTCuthxzlXjgV30E7qwAcs87PZW2tmVNi/PCpZUcOghjtfa0QC32AbXr0ONOAG+EBssdu4L755aKs4LSBMsipYovjfuDGqJRXPj8BIpVQGsGjF6Gx0k79K04kaF4bCzTKVS/KZOgEhVH5mN0ljPp+5MystzFLt9ep6ztUSE9/NJgEmh1dviUfffLg7hLd+mrWGKYIzZWvRkgbcTbIGoBIkjI866Vmif7F73wWfcJB9ZQONlNHeyfiXOlHDzVtBQwkvXoI+s1PchmaL3BdT0rxe5KpgUeMObHLAL30l8mmBPkNrLL2I6BOHDKWmQEpr7EvT8loVFNVxntK/VpFEyL2MPP9wgH+8VGUYs3Dsqa1jMlbHe3J8VE4dAgl+fFXKbu0Bveka65MoHXobjjWKnjjmJavD7By2IRGZsOHI3uRxx6t25N6FKd48VzACsX0VHGu2k4m5o3wHQyG0S11/ELM3Cvddv4uonTjNLundfGJLvgyr+Zk19IN7wj3YqOHkVXy6Mn7jhWKoyjiB1jYXtxwmSwU0ktO0XSHB1rpTkqJqaJEpbS9EjXX1YqB7A/BI/P/07qoYT+2HmxYeDwJbHEcF8NCXDkFEhgRes7Bc9sqhAYntDR6o0/KgmxhowZ3PQiXu7OeP0shrFcruBpEl1zyY08WVIHIS2b4MD9p1lOGK5Yr26HcRThnGQJoTkHQhRNnkjLVctETXLyXhDz09/yguQFqfmWDQ0U5MNg2ADyx7mrSA5q4E9k6M3k8xfBjFJrjR9/ACuTJJw="',
  );
});
