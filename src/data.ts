import { Tabs } from "webextension-polyfill-ts";

export type SchedulerInstructions = {
  showBy: Date;
};

export type History = {};

export type Item = {
  id: string;
  tabs: Tabs.Tab[];
  createdAt: Date;
  history: History;
  schedulerInstructions: SchedulerInstructions;
};

export type UserData = {
  items: Record<string, Item>;
};
