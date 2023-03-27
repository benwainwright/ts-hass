import { Logger as TsLogger } from "tslog";
import { APP_NAME } from "./constants";

export const logger = new TsLogger({ name: APP_NAME });
