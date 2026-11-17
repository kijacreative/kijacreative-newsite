/* Media from the live WordPress site.
   Run content-import/download-assets.sh from src/media/ so files land in
   src/media/wp-uploads/<year>/<month>/<file>. The build only references
   files that are actually present, so nothing breaks before the download,
   and photos appear everywhere the moment it has run. */
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const uploads = join(dirname(fileURLToPath(import.meta.url)), '..', 'media', 'wp-uploads');
export const LIVE_UPLOADS = 'https://kijacreative.com/wp-content/uploads/';
export const hasMedia = (p) => !!p && existsSync(join(uploads, p));
export const mediaUrl = (p) => '/assets/media/wp-uploads/' + p;
