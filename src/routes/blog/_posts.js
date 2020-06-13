import all from '../../posts/**/*.md'
import { parse } from 'path'

const 	_slugify_strip_re = /[^\w\s-]/g;
const _slugify_hyphenate_re = /[-\s]+/g;
function slugify(s) {
	s = parse(s).name
  s = s.replace(_slugify_strip_re, '').trim().toLowerCase();
  s = s.replace(_slugify_hyphenate_re, '-');
  return s;
}

function dateFormat(date) {
	const d = new Date(date)
	const month = ['Jan', 'Feb', 'Mar', 'May', 'Jun', 'Jul', 'Ags', 'Sep', 'Oct', 'Nov', 'Dec']
	return `${d.getFullYear()}, ${d.getDate()} ${month[d.getMonth()]}`
}

const posts = []

all.map(({ metadata, html, filename }) => {
	// "title", "date", "tags" are required fontmatter
	// if not exist then mark it as a non-posts content
	const { title, date, tags } = metadata

	// Set default tags if not defined
	metadata.tags = tags || ['uncategorized']
	// Format date
	metadata.date = dateFormat(date)

	if (title && date) {
		const slug = slugify(filename)
		const entry = {
			...metadata,
			html,
			slug
		}
		// Exclude if post has "draft" frontmatter
		!metadata.draft && posts.push(entry)
	}
})

// Sorting array of posts by latest "date"
export default posts.sort((a, b) => new Date(b.date) - new Date(a.date))
