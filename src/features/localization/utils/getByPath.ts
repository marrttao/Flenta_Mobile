function getByPath(object: unknown, path: string): string | undefined
{
	const parts = path.split('.');
	let cursor: unknown = object;

	for (const part of parts)
	{
		if (typeof cursor !== 'object' || cursor === null || !(part in (cursor as Record<string, unknown>))) { return undefined; }
		cursor = (cursor as Record<string, unknown>)[part];
	}

	return typeof cursor === 'string' ? cursor : undefined;
}



export { getByPath };