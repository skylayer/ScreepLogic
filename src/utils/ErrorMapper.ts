import { SourceMapConsumer } from "source-map";
import { escape } from "lodash";  // Importing escape function from lodash

export class ErrorMapper {
  // Cache consumer
  private static _consumer?: SourceMapConsumer;

  public static async getConsumer(): Promise<SourceMapConsumer> {
    if (this._consumer == null) {
      this._consumer = await new SourceMapConsumer(require("main.js.map"));
    }

    return this._consumer;
  }

  // Cache previously mapped traces to improve performance
  public static cache: { [key: string]: string } = {};

  public static async sourceMappedStackTrace(error: Error | string): Promise<string> {
    const consumer = await this.getConsumer();

    const stack: string = error instanceof Error ? (error.stack as string) : error;
    if (Object.prototype.hasOwnProperty.call(this.cache, stack)) {
      return this.cache[stack];
    }

    // eslint-disable-next-line no-useless-escape
    const re = /^\s+at\s+(.+?\s+)?\(?([0-z._\-\\\/]+):(\d+):(\d+)\)?$/gm;
    let match: RegExpExecArray | null;
    let outStack = error.toString();

    while ((match = re.exec(stack))) {
      if (match[2] === "main") {
        const pos = consumer.originalPositionFor({
          column: parseInt(match[4], 10),
          line: parseInt(match[3], 10)
        });

        if (pos.line != null) {
          if (pos.name) {
            outStack += `\n    at ${pos.name} (${pos.source}:${pos.line}:${pos.column})`;
          } else {
            if (match[1]) {
              // no original source file name known - use file name from given trace
              outStack += `\n    at ${match[1]} (${pos.source}:${pos.line}:${pos.column})`;
            } else {
              // no original source file name known or in given trace - omit name
              outStack += `\n    at ${pos.source}:${pos.line}:${pos.column}`;
            }
          }
        } else {
          // no known position
          break;
        }
      } else {
        // no more parseable lines
        break;
      }
    }

    this.cache[stack] = outStack;
    return outStack;
  }

  public static wrapLoop(loop: () => void): () => void {
    return async () => {
      try {
        loop();
      } catch (e) {
        if (e instanceof Error) {
          if ("sim" in Game.rooms) {
            const message = `Source maps don't work in the simulator - displaying original error`;
            console.log(`<span style='color:red'>${message}<br>${escape(e.stack)}</span>`);
          } else {
            console.log(`<span style='color:red'>${escape(await this.sourceMappedStackTrace(e))}</span>`);
          }
        } else {
          // can't handle it
          throw e;
        }
      }
    };
  }
}
