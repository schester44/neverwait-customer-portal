import React from 'react'
import { FiX } from 'react-icons/fi'
const iOSShareBase64 =
	'iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAActpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgSW1hZ2VSZWFkeTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KKS7NPQAAAsxJREFUSA2lVjFrFFEQnnm7l2iiF2LuEggWImchFjb5B4KFhZ3+AC1io1hZJedyYGNjERANaB9FG0FBBGuLIBamukYQRXN4GnKSy+6+cebt283buz3dmIF3O2/ezHwz82ZnD+BfdIm8VKW+vLsmK92Dc5bJ9sUEpFL9+nL4bPYOkSzhUzk4OpnMYdDh86wYBqjFQU1HrxGoDoA9qzRBAJ2O8s+nOuaZ92B2xQBECIh0JqCxbzp6yUpnp7r+8a1j8WMADdUfn678mj7xmUE+zCn/wscAd8HaDGJkJRg8kH0XvvqI8A6VPtdewT6LjrCfo+2VU32RyVkXwC+yHSHjyCUSWQW1rTej57KGjEU3tQO2dchBlwMk2DvmCpQkc1eurvXFogTgCbfiZYxrSzsXUal7DBQDmPaMEPiOgR51WpVbLMsCqjXDuwrwKoHuAChuZdJiQ6Budlr4AqzPxOANyF3EgF6DL/ckkb7GNpMQx2I0gYjvJT5OjvcJcRe8JaKfnOZv8FCB1j1E7wEQNIyG9ZkAzLNYCBUh6Y3N1thDsx/4YaUMYLPlv+JjWRnNNsMbnEGytz6zlFMtjuqw4blF4UsC3BgHJV1Ezg01rtN4u28B5zk5blVju3eHxk0egDRnbrO5DaG8C6LVDpLac6mSTEU2wyUNMDJeTNcxJ7biw6E8gHNQxHKEOeMiHSmzK98XACobsethkD9gBtOD/ob2/5mB6R6llPsWZx01BOIIypXITtXvAd43tumkdRyNYssBiLWApB+YQN70clQeQPw9Le84hf/ruE6VDvLMZ2A6wLbx4rrPA6vURcLiugQa8tAbiiUPwOORh1ZS39WFEFaH9EcJEhsSW/4MOZQDQB2LQnVmiU77GFYjz44Nx6CI9XkOR1TZ4t8qT4sEzCrmAFi2rSb9OdyBDVIVyP6vFHl1ZPLl8LiYeMgH3Qu3nSP4A9EHFXrGnVaNAAAAAElFTkSuQmCC'

const STORAGE_KEY = 'nw-portal-aths-shown'

const AddToHomeScreen = () => {
	const [visible, setVisible] = React.useState(
		navigator &&
			typeof navigator.standalone !== 'undefined' &&
			navigator.standalone === false &&
			!localStorage.getItem(STORAGE_KEY)
	)

	React.useEffect(() => {
		const listener = e => {
			if (!visible) {
				window.removeEventListener('scroll', listener)
			} else {
				if (window.scrollY > 250) {
					setVisible(false)
				}
			}
		}

		window.addEventListener('scroll', listener)

		return () => window.removeEventListener('scroll', listener)
	}, [visible])

	if (!visible) return null

	return (
		<div
			style={{
				background: 'rgba(32,32,32,0.8)'
			}}
			className="fixed top-0 left-0 w-full z-50 pt-8 px-4 pb-4 text-white shadow-lg"
		>
			<FiX
				onClick={() => {
					localStorage.setItem(STORAGE_KEY, true)
					setVisible(false)
				}}
				style={{
					position: 'absolute',
					top: 10,
					right: 10,
					fontSize: 24,
					color: 'white'
				}}
			/>

			<div className="text-center text-sm">
				Save this page as an app for quicker access! Just tap the share button (
				<img
					alt="Add to home screen"
					className="w-4 h-4 align-middle inline"
					src={`data:image/png;base64,${iOSShareBase64}`}
				/>
				) down below then find and tap the 'Add to Home Screen' button.
			</div>
		</div>
	)
}

export default AddToHomeScreen
