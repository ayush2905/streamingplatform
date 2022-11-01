import Env from "../src";
import path from "path";

let env: Env;

describe("Env", () => {
  beforeEach(() => {
    env = new Env();
  });

  describe("loadDefaults", () => {
    test("loads an exisiting file", async () => {
      await env.loadDefaults(path.join(__dirname, "defaults.ts"));
      expect(env.getString("STRING")).toEqual("foo");
    });

    test("loads an non exisiting file", async () => {
      await expect(
        env.loadDefaults(path.join(__dirname, "defaults_does_not_exists.ts"))
      ).rejects.toThrow("Cannot find Module");
    });

    test("loads an exisiting file with another export", async () => {
      await expect(
        env.loadDefaults(path.join(__dirname, "defaults_invalid.ts"))
      ).rejects.toThrow("Module Structure wrong");
    });

    test("loads an exisiting file with no keys", async () => {
      await expect(
        env.loadDefaults(path.join(__dirname, "defaults_empty.ts"))
      ).rejects.toThrow("Module has no Keys");
    });
  });

  describe("getString", () => {
    test("variable exists", () => {
      process.env.FOO = "foo";
      const env = new Env();
      expect(env.getString("FOO")).toEqual("foo");
      delete process.env["FOO"];
    });

    test("default variable exists", async () => {
      const env = new Env();
      const filePath = path.join(__dirname, "defaults.ts");
      await env.loadDefaults(filePath);
      expect(env.getString("STRING")).toEqual("foo");
      delete process.env["FOO"];
    });

    test("variable does not exist", () => {
      expect(env.getString("FOO")).toEqual(null);
    });

    test("variable default value", () => {
      process.env.FOO = "1";
      env = new Env();
      expect(env.getString("FOO", "foo")).toEqual("1");
    });
  });

  describe("getInt", () => {
    test("variable exists", () => {
      process.env.FOO = "1";
      env = new Env();
      expect(env.getInt("FOO")).toEqual(1);
      delete process.env["FOO"];
    });

    test("variable does not exist", () => {
      expect(env.getInt("FOO")).toEqual(null);
    });

    test("variable default value", () => {
      expect(env.getInt("FOO", 1)).toEqual(1);
    });
  });

  describe("getFloat", () => {
    test("variable exists", () => {
      process.env.FOO = "1.1";
      env = new Env();
      expect(env.getFloat("FOO")).toEqual(1.1);
      delete process.env["FOO"];
    });

    test("variable does not exist", () => {
      expect(env.getFloat("FOO")).toEqual(null);
    });

    test("variable default value", () => {
      expect(env.getFloat("FOO", 1.1)).toEqual(1.1);
    });

    test("variable has wrong type", () => {
      process.env.FOO = "wrong type";
      env = new Env();
      expect(() => env.getFloat("FOO")).toThrow();
      delete process.env["FOO"];
    });
  });

  describe("getArray", () => {
    test("variable exists as string array", () => {
      process.env.FOO = '["a", "b"]';
      env = new Env();
      expect(env.getArray("FOO")).toEqual(["a", "b"]);
      delete process.env["FOO"];
    });

    test("variable exists as csv", () => {
      process.env.FOO = "a,b";
      env = new Env();
      expect(env.getArray("FOO")).toEqual(["a", "b"]);
      delete process.env["FOO"];
    });

    test("variable does not exist", () => {
      expect(env.getFloat("FOO")).toEqual(null);
    });

    test("variable default value", () => {
      expect(env.getArray("FOO", ["a", "b"])).toEqual(["a", "b"]);
    });

    test("variable has wrong type", () => {
      process.env.FOO = "wrong type";
      env = new Env();
      expect(() => env.getFloat("FOO")).toThrow();
      delete process.env["FOO"];
    });
  });

  describe("getBoolean", () => {
    test(`variable does not exists`, () => {
      expect(env.getBoolean("FOO", true)).toEqual(true);
    });

    ["y", "yes", "1", "true", "on"].forEach((t: string) => {
      test(`variable exists as "${t}"`, () => {
        process.env.FOO = t;
        env = new Env();
        expect(env.getBoolean("FOO")).toEqual(true);
        delete process.env["FOO"];
      });
    });

    ["n", "no", "0", "false", "off"].forEach((t: string) => {
      test(`variable exists as "${t}"`, () => {
        process.env.FOO = t;
        env = new Env();
        expect(env.getBoolean("FOO")).toEqual(false);
        delete process.env["FOO"];
      });
    });
    ["nope", "not", "here"].forEach((t: string) => {
      test(`variable exists as  "${t}"`, () => {
        process.env.FOO = t;
        env = new Env();
        expect(env.getBoolean("FOO")).toEqual(false);
        delete process.env["FOO"];
      });
    });
  });
});
