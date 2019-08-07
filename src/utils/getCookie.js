export default function getCookieValue(a) {
	const b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)')
	return b ? b.pop() : undefined
}
