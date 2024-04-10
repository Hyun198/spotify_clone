import searchSong from './searchSong.js';
import getLyrics from './utils/extractLyrics.js';
import { checkOptions } from './utils/index.js';

/**
 * @param {{apiKey: string, title: string, artist: string, optimizeQuery: boolean}} options
 * @returns {Promise<{id: number, title: string, url: string, lyrics: string, albumArt: string}>}
 */
export default async function fetchSong(options) {
	try {
		checkOptions(options);
		const results = await searchSong(options);
		if (!results) return null;
		const lyrics = await getLyrics(results[0].url);
		return {
			id: results[0].id,
			title: results[0].title,
			url: results[0].url,
			lyrics,
			albumArt: results[0].albumArt
		};
	} catch (error) {
		throw error;
	}
}