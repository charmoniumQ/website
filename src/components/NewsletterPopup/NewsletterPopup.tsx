import Button from "../Button/Button"
import styled, {css} from 'styled-components';
import { useState, useEffect } from "react"
import Text
 from "../Text/Text";
import { FaRegTimesCircle } from "react-icons/fa";

const SubscribeButton = styled((props: any) => (
    <Button large variant="neutral" {...props} />
  ))`
    font-size: 0.9rem;
    margin-top:15px;
    width:100%
    
  `;

const PopupContainer = styled.div<{appear_prop: boolean}>`
    position:fixed;
    z-index:1;
    bottom: ${props => props.appear_prop ? '1.5%' : '-100%'};
    right:1%;

    width:240px;
    display:flex;
    flex-wrap:wrap;
    justify-content:center;
    text-align:center;

    background-color:#efefef;

    border: 2px solid rgba(62, 72, 111, 0.1);
    border-radius: 15px;

    padding:1%;
    transition: all 0.4s ease;
    transition: bottom 1s ease;
    &:hover {
        filter: grayscale(0%) drop-shadow(0 4px 12px rgb(104 112 118 / 0.08)) drop-shadow(0 20px 8px rgb(104 112 118 / 0.04));
        transform: translateY(-1px);
        
      }
    @media (max-width:600px) {
        display: none;
    }

`;

const DescriptionText = styled(Text)`
    line-height: 24px;
    margin: 0px;
    overflow: hidden;
    width:91%;
    font-size:0.9rem;

`;


const IconImage = css`
  width: 28px;
  height: 22px;
  color: #000000;
  margin: -5px 0px 0px 215px;
  cursor: pointer;

`;

const IconX = styled(FaRegTimesCircle)`
  ${IconImage}
`;


function NewsletterPopup() {
    const [closedPopup, setClosedPopup] = useState(false);

    useEffect(() => {
        const listenToScroll = () => {
            let hiddenHeight = 200;
            const winScroll = document.body.scrollTop ||
                document.documentElement.scrollTop;
            if (winScroll > hiddenHeight) {
                setAppear(false);
            } else {
                setAppear(true);
            }
        };
        window.addEventListener("scroll", listenToScroll);
        return () =>
            window.removeEventListener("scroll", listenToScroll);
    }, [])

    const [appear, setAppear] = useState(true);
    if (!closedPopup) {
        return (
            <PopupContainer appear_prop={appear}>
                <IconX onClick={() => {setClosedPopup(true)}}/>
                <DescriptionText>Interested in recieving updates via email? Click below to subscribe to our newsletter!</DescriptionText>
                <a
                href="https://listmonk.acm.illinois.edu/subscription/form"
                target="_blank"
                rel="noopener noreferrer"       
                >
                <SubscribeButton>Subscribe</SubscribeButton>
                </a>
            </PopupContainer>   
        )
    } else {
        return null;
    }
    
}
export default NewsletterPopup