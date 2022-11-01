import { envConstructorOptions } from "./types";

interface tenvInterface {
  loadDefaults(filePath: string): Promise<void>;
  getString(name: string, defaultValue: string): string;
  getInt(name: string, defaultValue: number): number;
  getFloat(name: string, defaultValue: number): number;
  getArray(name: string, defaultValue: any[]): any[];
  getBoolean(name: string, defaultValue: boolean): boolean;
}

export default class tenv implements tenvInterface {
  private prefixSeparate: string = "_";
  private prefix: string = "";
  private defaults: object = {};
  private throwOnError: boolean = true;

  constructor(options?: envConstructorOptions) {
    if (!options) return;
    for (let option in options) {
      this[option] = options[option];
    }
  }

  private getEnvironmentVariable(name: string): string {
    const prefix = `${this.prefix}${this.prefixSeparate}`;
    if (prefix !== this.prefixSeparate) {
      name = `${prefix}${name}`;
    }

    if (this.defaults[name]) {
      return this.defaults[name];
    }

    if (process.env[name] !== undefined) {
      return process.env[name];
    }
    return null;
  }

  private getTypedEnvironmenVariable(
    name: string,
    defaultValue: any,
    type: string
  ): any {
    let variable: any = this.getEnvironmentVariable(name);
    if (!variable) {
      variable = defaultValue;
    }

    if (!variable) {
      return null;
    }

    let parsed: any;

    switch (type) {
      case "string":
        return String(variable);
      case "int":
        parsed = parseInt(variable);
        if (isNaN(parsed)) return this.typeConersionError();
        break;
      case "boolean":
        if(typeof variable == "boolean") {
          parsed = variable
        } else if (["true", "yes", "y", "1", "on"].includes(variable)) {
          parsed = true;
        } else if (["false", "no", "n", "0", "off"].includes(variable)) {
          parsed = false;
        } else {
          parsed = false
        }

        break;
      case "float":
        parsed = parseFloat(variable);
        if (isNaN(parsed)) return this.typeConersionError();
        break;
      case "array":
        if (Array.isArray(variable)) {
          parsed = variable;
        } else {
          try {
            parsed = JSON.parse(variable);
          } catch (e) {
            parsed = variable.split(",");
          }
        }
        break;
    }

    return parsed;
  }

  private baseError(error: string) {
    if (!this.throwOnError) return undefined;
    throw new Error(error);
  }

  private typeConersionError() {
    this.baseError("Cannot convert types error");
  }

  private moduleNotFoundError() {
    this.baseError("Cannot find Module");
  }

  private moduleStructureWrongError() {
    this.baseError("Module Structure wrong");
  }

  private moduleEmptyError() {
    this.baseError("Module has no Keys");
  }

  public async loadDefaults(filePath: string): Promise<void> {
    let defaults: any;
    try {
      defaults = await import(filePath);
    } catch (e) {
      return this.moduleNotFoundError();
    }

    if (!defaults.hasOwnProperty("defaults")) {
      return this.moduleStructureWrongError();
    }

    if (Object.keys(defaults.defaults).length === 0) {
      return this.moduleEmptyError();
    }

    this.defaults = defaults.defaults;
  }

  /**
   * returns a string
   * @param name Defines the environment variable to fetch
   * @param defaultValue Defines the fallback value in case the requested variable is not found in the defaults nor the environment
   */
  public getString(name: string, defaultValue?: string): string {
    return this.getTypedEnvironmenVariable(name, defaultValue, "string");
  }

  /**
   * returns a boolean
   * True values are one of `true` "true", "yes", "1" and 'on'
   * False values are one of `false` "false", "no", "0", 'off'
   * @param name Defines the environment variable to fetch
   * @param defaultValue Defines the fallback value in case the requested variable is not found in the defaults nor the environment
   */
  public getBoolean(name: string, defaultValue?: boolean): boolean {
    return this.getTypedEnvironmenVariable(name, defaultValue, "boolean");
  }

  /**
   * Returns an integer
   * @param name Defines the environment variable to fetch
   * @param defaultValue Defines the fallback value in case the requested variable is not found in the defaults nor the environment
   */
  public getInt(name: string, defaultValue?: number): number {
    return this.getTypedEnvironmenVariable(name, defaultValue, "int");
  }

  /**
   *
   * @param name Defines the environment variable to fetch
   * @param defaultValue Defines the fallback value in case the requested variable is not found in the defaults nor the environment
   */
  public getIntOrAny(name: string, defaultValue?: number): number | any {
    return this.getTypedEnvironmenVariable(name, defaultValue, "int");
  }

  /**
   * Returns a float
   * @param name Defines the environment variable to fetch
   * @param defaultValue Defines the fallback value in case the requested variable is not found in the defaults nor the environment
   */
  public getFloat(name: string, defaultValue?: number): number {
    return this.getTypedEnvironmenVariable(name, defaultValue, "float");
  }

  /**
   * Returns an array. I can parse a `JSON`` back to an array or it splits a string at a `,`
   * @param name Defines the environment variable to fetch
   * @param defaultValue Defines the fallback value in case the requested variable is not found in the defaults nor the environment
   */
  public getArray(name: string, defaultValue?: any[]): any[] {
    return this.getTypedEnvironmenVariable(name, defaultValue, "array");
  }

  /**
   * Will prevent tenv to throw errors
   */
  public quiet() {
    this.throwOnError = false;
  }
}
