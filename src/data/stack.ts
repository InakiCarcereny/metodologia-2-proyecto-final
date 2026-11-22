import { and, count, desc, eq, isNotNull } from 'drizzle-orm';
import { db } from '@/db';
import { posts } from '@/db/schema';

export interface StackLanguage {
  count: number;
  language: string;
}

export async function getInferredStack(
  userId: string,
): Promise<StackLanguage[]> {
  const rows = await db
    .select({
      count: count(),
      language: posts.codeLanguage,
    })
    .from(posts)
    .where(and(eq(posts.idUser, userId), isNotNull(posts.codeLanguage)))
    .groupBy(posts.codeLanguage)
    .orderBy(desc(count()))
    .limit(5);

  return rows.map(({ count: languageCount, language }) => ({
    count: languageCount,
    language: language as string,
  }));
}
