import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { FC, useMemo } from "react";
import MainButton from "../../../components/MainButton/MainButton";
import NESTLine from "../../../components/NESTLine";
import NormalInfo from "../../../components/NormalInfo/NormalInfo";
import NESTInput from "../../../components/NormalInput/NESTInput";
import useFuturesAdd from "../../../hooks/useFuturesAdd";
import { FuturesOrderV2 } from "../../../hooks/useFuturesOrderList";
import useWindowWidth from "../../../hooks/useWindowWidth";
import BaseDrawer from "../../Share/Modal/BaseDrawer";
import BaseModal from "../../Share/Modal/BaseModal";
import { FuturesPrice } from "../Futures";

interface AddModalBaseProps {
  data: FuturesOrderV2;
  price: FuturesPrice | undefined;
  onClose: () => void;
}

const AddModalBase: FC<AddModalBaseProps> = ({ ...props }) => {
  const {
    checkBalance,
    showToSwap,
    showBalance,
    maxCallBack,
    nestAmount,
    setNestAmount,
    showPosition,
    showOpenPrice,
    showLiqPrice,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
  } = useFuturesAdd(props.data, props.price, props.onClose);
  const input = useMemo(() => {
    return <NESTInput
    checkBalance={checkBalance}
    showToSwap={showToSwap}
    showBalance={showBalance}
    maxCallBack={maxCallBack}
    nestAmount={nestAmount}
    changeNestAmount={(value: string) =>
      setNestAmount(value.formatInputNum4())
    }
  />
  }, [checkBalance, maxCallBack, nestAmount, setNestAmount, showBalance, showToSwap])
  return (
    <Stack spacing={"24px"} width={"100%"}>
      {input}
      <NESTLine />
      <Stack spacing={"8px"}>
        <NormalInfo title={"Position"} value={""} symbol={showPosition} />
        <NormalInfo
          title={"Open Price"}
          value={showOpenPrice}
          symbol={"USDT"}
        />
        <NormalInfo title={"Liq Price"} value={showLiqPrice} symbol={"USDT"} />
      </Stack>
      <MainButton
        title={mainButtonTitle}
        disable={mainButtonDis}
        isLoading={mainButtonLoading}
        onClick={mainButtonAction}
        style={{ fontSize: 14 }}
      />
    </Stack>
  );
};

interface AddModalProps {
  data: FuturesOrderV2;
  price: FuturesPrice | undefined;
  open: boolean;
  onClose: () => void;
}

const AddModal: FC<AddModalProps> = ({ ...props }) => {
  const { isMobile } = useWindowWidth();
  const view = useMemo(() => {
    return isMobile ? (
      <Drawer
        anchor={"bottom"}
        open={props.open}
        onClose={props.onClose}
        sx={{
          "& .MuiPaper-root": { background: "none", backgroundImage: "none" },
        }}
        keepMounted
      >
        <BaseDrawer title={"Add Position"} onClose={props.onClose}>
          <AddModalBase
            data={props.data}
            price={props.price}
            onClose={props.onClose}
          />
        </BaseDrawer>
      </Drawer>
    ) : (
      <Modal
        open={props.open}
        onClose={() => props.onClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <BaseModal title={"Add Position"} onClose={props.onClose}>
            <AddModalBase
              data={props.data}
              price={props.price}
              onClose={props.onClose}
            />
          </BaseModal>
        </Box>
      </Modal>
    );
  }, [isMobile, props]);

  return view;
};

export default AddModal;
