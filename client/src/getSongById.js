import axios from 'axios';
import getLyrics from './utils/extractLyrics.js';

const url = 'https://api.genius.com/songs/';

/**
 * @param {(number|string)} id
 * @param {string} apiKey
 * @returns {Promise<{id: number, title: string, url: string, lyrics: string, albumArt: string}>}
 */
export default async function fetchSongDetails(id, apiKey) {
	if (!id) throw new Error('No id was provided');
	if (!apiKey) throw new Error('No apiKey was provided');
	try {
		const response = await axios.get(`${url}${id}?access_token=${apiKey}`);
		const song = response.data.response.song;
		const lyrics = await getLyrics(song.url);
		return {
			id: song.id,
			title: song.full_title,
			url: song.url,
			lyrics,
			albumArt: song.song_art_image_url
		};
	} catch (error) {
		throw error;
	}
}