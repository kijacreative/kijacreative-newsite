/* Media from the live WordPress site.
   Run content-import/download-assets.sh from src/media/ so files land in
   src/media/wp-uploads/<year>/<month>/<file>. The build only references
   files that are actually present, so nothing breaks before the download,
   and photos appear everywhere the moment it has run. */
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const media = join(dirname(fileURLToPath(import.meta.url)), '..', 'media');
export const LIVE_UPLOADS = 'https://kijacreative.com/wp-content/uploads/';
// '2026/02/x.webp' → the live-site uploads; 'studio/…' and 'selects/…' → their own folders
const rel = (p) => (/^(studio|selects)\//.test(p) ? p : 'wp-uploads/' + p);
export const hasMedia = (p) => !!p && existsSync(join(media, rel(p)));
export const mediaUrl = (p) => '/assets/media/' + rel(p).split('/').map(encodeURIComponent).join('/');
