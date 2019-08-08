import { createGlobalStyle } from 'styled-components'

export const createStyles = ({ theme, custom = '' }) => {
	return createGlobalStyle`
        @import url('https://fonts.googleapis.com/css?family=Lato');

        @font-face {
            font-family: 'marguerite';
            src: url('./Blacksword.otf');
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body,
        html,
        #root {
            width: 100%;
            height: 100%;
            color: ${theme.colors.bodyColor};
            background: ${theme.colors.bodyBg};
            font-family: ${theme.fontStack.default};
        }

        ${custom}
    `
}
