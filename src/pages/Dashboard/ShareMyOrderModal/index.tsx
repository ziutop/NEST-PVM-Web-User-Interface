import {FC, useRef, useState} from "react";
import Popup from "reactjs-popup";
import {Divider, Stack} from "@mui/material";
import MainButton from "../../../components/MainButton";
import {QRCodeCanvas} from "qrcode.react";
import domtoimage from "../../../libs/dom-to-image";
import useWeb3 from "../../../libs/hooks/useWeb3";
import BaseModal from "../DashboardModal";
import {OrderView} from "../FuturesList";
import useTokenPairSymbol from "../../../libs/hooks/useTokenPairSymbol";
import {LongIcon, NESTLogo, ShareIcon, ShortIcon} from "../../../components/Icon";
import useThemes, {ThemeType} from "../../../libs/hooks/useThemes";

type ShareMyDealModalProps = {
  order: OrderView
}

const ShareMyDealModal: FC<ShareMyDealModalProps> = ({order}) => {
  const [hasCopied, setHasCopied] = useState(false)
  const {account} = useWeb3()
  const modal = useRef<any>();
  const {TokenOneSvg, TokenTwoSvg} = useTokenPairSymbol(order.tokenPair)
  const { theme } = useThemes();

  const copy = () => {
    const link = `https://finance.nestprotocol.org/#/futures?a=${account?.slice(-8).toLowerCase()}`
    navigator.clipboard.writeText(link).then(() => {
      setHasCopied(true)
      setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    })
  }

  const download = () => {
    const node = document.getElementById('my-share');
    if (node) {
      domtoimage.toPng(node, {
        bgcolor: '#f1fff9',
        width: node.clientWidth || 360,
        height: node.clientHeight || 640,
        quality: 1,
        scale: 2,
      })
        .then(function (dataUrl) {
          const link = document.createElement('a');
          link.download = `${account}.png`;
          link.href = dataUrl;
          link.click();
        })
    }
  }

  const tweet = () => {
    const text = `Follow the right person, making money is as easy as breathing.
You can follow the right person on NESTFi, here is my refer link:`
    const link = `https://finance.nestprotocol.org/#/futures?a=${account?.slice(-8).toLowerCase()}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURI(text)}&url=${link}&hashtags=NEST,btc,eth&via=NEST_Protocol`)
  }

  return (
    <Popup
      modal
      ref={modal}
      trigger={
      <Stack style={{ cursor: 'pointer', alignItems: "center" }}>
        <ShareIcon />
      </Stack>
      }
    >
      <BaseModal
        onClose={() => {
          modal?.current?.close()
        }}
        titleName={''}
      >
        <Stack id={'my-share'} width={'100%'} textAlign={"center"} px={'28px'} overflow={'hidden'} borderRadius={'20px'}
               style={{ backgroundImage:  'url(/DashboardImage/pc_share_bg_2.png)', backgroundPosition: 'center', backgroundSize: 'cover', overflow: 'hidden' }}
               spacing={'22px'}>
          <Stack pt={'28px'} alignItems={"center"}>
            <NESTLogo/>
          </Stack>

          <Stack direction={'row'} justifyContent={'space-around'} borderTop={'1px solid #CCDDF4'} alignItems={"center"}
                 minHeight={'40px'} py={'10px'}
                 borderBottom={'1px solid #CCDDF4'}>
            <Stack direction={'row'} spacing={'6px'} width={'100px'} justifyContent={"center"}>
              {order.orientation === 'Long' ? <LongIcon /> : <ShortIcon />}
              <p style={{ fontWeight: 'bold', color: order.orientation === 'Long' ? '#DD8751' : '#63C8A7' }}>{order.orientation}</p>
            </Stack>
            <p style={{fontWeight: 700, fontSize: '12.5px', color: '#2F759D'}}>{order.leverage}</p>
            <Stack direction={'row'} spacing={'-10px'} width={'100px'} justifyContent={"center"}>
              <TokenOneSvg/>
              <TokenTwoSvg/>
            </Stack>
          </Stack>
          <Stack spacing={'24px'} py={'60px'}>
            <Stack>
              <p style={{fontSize: '12.5px', fontWeight: 500, color: '#2F759D'}}>Total Profit</p>
              <p style={{
                fontSize: '80px',
                fontWeight: 700,
                color: '#0047BB'
              }}>{order.actualRate.toLocaleString('US', {maximumFractionDigits: 2})}%</p>
            </Stack>
            <Stack spacing={'8px'}>
              <p style={{fontSize: '12.5px', fontWeight: 500, color: '#2F759D'}}>Last price</p>
              <p style={{
                fontSize: '16px',
                fontWeight: 500,
                color: '#003232'
              }}>{order.lastPrice.toLocaleString('US', {maximumFractionDigits: 2})}</p>
            </Stack>
            <Stack spacing={'8px'}>
              <p style={{fontSize: '12.5px', fontWeight: 500, color: '#2F759D'}}>Avg Open Price</p>
              <p style={{
                fontSize: '16px',
                fontWeight: 500,
                color: '#003232'
              }}>{order.openPrice.toLocaleString('US', {maximumFractionDigits: 2})}</p>
            </Stack>
          </Stack>
          <Divider/>
          <Stack alignItems={"center"} pb={'80px'}>
            <QRCodeCanvas value={`https://finance.nestprotocol.org/#/futures?a=${account?.slice(-8).toLowerCase()}`}
                          size={80}/>
          </Stack>
        </Stack>
        <Stack width={'100%'} direction={'row'} position={'absolute'} bottom={22} spacing={'16px'} className={theme === ThemeType.dark ? 'dark' : ''}
               px={'60px'}>
          <MainButton className={'dashboard-button'} onClick={copy}>
            {hasCopied ? 'Copied' : 'Copy'}
          </MainButton>
          <MainButton className={'dashboard-button'} onClick={download}>
            Download
          </MainButton>
          <MainButton className={'dashboard-button'} onClick={tweet}>
            Twitter
          </MainButton>
        </Stack>
      </BaseModal>
    </Popup>
  )

}

export default ShareMyDealModal;