import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hashPassword, verifyPassword } from "./password.ts";

describe("password hashing", () => {
  it("never stores the plain password and verifies correctly", async () => {
    const hash = await hashPassword("learn1234");
    assert.ok(hash.startsWith("scrypt:"));
    assert.ok(!hash.includes("learn1234"));
    assert.equal(await verifyPassword("learn1234", hash), true);
    assert.equal(await verifyPassword("learn12345", hash), false);
  });

  it("gives the same password a different hash each time (random salt)", async () => {
    assert.notEqual(await hashPassword("same-pass1"), await hashPassword("same-pass1"));
  });

  it("rejects a malformed stored hash", async () => {
    assert.equal(await verifyPassword("anything", "not-a-hash"), false);
  });
});
