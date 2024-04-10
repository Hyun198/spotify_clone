import searchSong from './searchSong.js';
import { checkOptions } from './utils/index.js';

/**
 * @param {{apiKey: string, title: string, artist: string, optimizeQuery: boolean}} options
 * @returns {Promise<string>}
 */
export default async function fetchAlbumArt(options) {
	checkOptions(options);
	const results = await searchSong(options);
	if (!results) return null;
	return results[0].albumArt;
}