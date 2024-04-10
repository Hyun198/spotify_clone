import searchSong from './searchSong.js';
import { checkOptions } from './utils/index.js';
import getLyrics from './utils/extractLyrics.js';

/**
 * @param {({apiKey: string, title: string, artist: string, optimizeQuery: boolean}|string)} arg - options object, or Genius URL
 */
export default async function getSongLyrics(arg) {
	try {
		if (arg && typeof arg === 'string') {
			let lyrics = await getLyrics(arg);
			return lyrics;
		} else if (typeof arg === 'object') {
			checkOptions(arg);
			let results = await searchSong(arg);
			if (!results) return null;
			let lyrics = await getLyrics(results[0].url);
			return lyrics;
		} else {
			throw 'Invalid argument';
		}
	} catch (e) {
		throw e;
	}
}