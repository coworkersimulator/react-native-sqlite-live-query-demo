import { relations } from "drizzle-orm/relations";
import { fruit, click } from "./schema";

export const clickRelations = relations(click, ({one}) => ({
	fruit: one(fruit, {
		fields: [click.on],
		references: [fruit.id]
	}),
}));

export const fruitRelations = relations(fruit, ({many}) => ({
	clicks: many(click),
}));