import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { BigNumber } from "ethers";
import { FC, useMemo } from "react";
import { Close, Share } from "../../../components/icons";
import MainButton from "../../../components/MainButton/MainButton";
import { FuturesOrderV2 } from "../../../hooks/useFuturesOrderList";
import useFuturesPOrder from "../../../hooks/useFuturesPOrder";
import useFuturesPOrderClose from "../../../hooks/useFuturesPOrderClose";
import ShareMyOrderModal from "../../Dashboard/Modal/ShareMyOrderModal";
import { FuturesPrice } from "../Futures";
import { FuturesModalInfo, FuturesModalType } from "../OrderList";
import FuturesOrderShare from "./FuturesOrderShare";
import OrderTablePosition from "./OrderTablePosition";
import FuturesTableTitle from "./TableTitle";

interface FuturesPOrderListProps {
  dataArray: Array<FuturesOrderV2>;
  closeOrder: Array<FuturesOrderV2>;
  hideOrder: (orderIndex: BigNumber, hash: string) => void;
  price: FuturesPrice | undefined;
  buttonCallBack: (value: FuturesModalInfo) => void;
  style?: React.CSSProperties;
}

const POrderTable: FC<FuturesPOrderListProps> = ({ ...props }) => {
  const rows = props.dataArray.map((item, index) => {
    return (
      <POrderTableRow
        key={`POrderTable + ${index}`}
        data={item}
        price={props.price}
        buttonCallBack={props.buttonCallBack}
      />
    );
  });
  const closeRows = props.closeOrder.map((item, index) => {
    return (
      <POrderTableCloseRow
        key={`POrderCloseTable + ${index}`}
        data={item}
        price={props.price}
        hideOrder={props.hideOrder}
      />
    );
  });
  const noOrder = useMemo(() => {
    if (props.dataArray.length === 0 && props.closeOrder.length === 0) {
      return true;
    }
    return false;
  }, [props.closeOrder.length, props.dataArray.length]);

  return (
    <FuturesTableTitle
      dataArray={[
        "Symbol",
        "Actual Margin",
        "Open Price",
        "Liq Price",
        "Stop Order",
        "Operate",
      ]}
      noOrder={noOrder}
      helps={[
        {
          index: 3,
          helpInfo: (
            <p>
              Due to the market volatility, the actual liquidation price may be
              different from the theoretical liquidation price . Here is the
              theoretical liquidation price, for reference only.
            </p>
          ),
        },
      ]}
      style={props.style}
      noNeedPadding
    >
      {rows}
      {closeRows}
    </FuturesTableTitle>
  );
};

const tdNoPadding = {
  padding: '0px !important',
}

interface POrderTableRowProps {
  data: FuturesOrderV2;
  price: FuturesPrice | undefined;
  buttonCallBack: (value: FuturesModalInfo) => void;
}
const POrderTableRow: FC<POrderTableRowProps> = ({ ...props }) => {
  const {
    tokenName,
    isLong,
    lever,
    showBasePrice,
    showTriggerTitle,
    tp,
    sl,
    showLiqPrice,
    showMarginAssets,
    showPercent,
    isRed,
    showShareOrderModal,
    setShowShareOrderModal,
    shareOrder,
  } = useFuturesPOrder(props.data, props.price);
  return (
    <TableRow
      sx={(theme) => ({ "&: hover": { background: theme.normal.bg1 } })}
    >
      <ShareMyOrderModal
        value={shareOrder}
        open={showShareOrderModal}
        onClose={() => {
          setShowShareOrderModal(false);
        }}
      />
      <TableCell>
        <OrderTablePosition
          tokenName={tokenName}
          isLong={isLong}
          lever={lever}
        />
      </TableCell>
      <TableCell sx={tdNoPadding}>
        <Stack
          direction={"row"}
          spacing={"4px"}
          alignItems={"flex-end"}
          sx={(theme) => ({
            "& p": {
              fontWeight: 700,
              fontSize: 14,
              color: theme.normal.text0,
            },
            "& span": {
              display: 'block',
              fontWeight: 400,
              fontSize: 10,
              color: isRed ? theme.normal.danger : theme.normal.success,
            },
          })}
        >
          <p>{showMarginAssets}NEST</p>
          <span>{showPercent}%</span>
        </Stack>
      </TableCell>
      <TableCell sx={tdNoPadding}>
        <Box
          component={"p"}
          sx={(theme) => ({
            fontWeight: 700,
            fontSize: 14,
            color: theme.normal.text0,
          })}
        >
          {showBasePrice}USDT
        </Box>
      </TableCell>
      <TableCell sx={tdNoPadding}>
        <Box
          component={"p"}
          sx={(theme) => ({
            fontWeight: 700,
            fontSize: 14,
            color: theme.normal.text0,
          })}
        >
          {showLiqPrice}USDT
        </Box>
      </TableCell>
      <TableCell sx={tdNoPadding}>
        <Stack
          spacing={"4px"}
          sx={(theme) => ({
            "& p": {
              fontSize: 12,
              fontWeight: 400,
              color: theme.normal.text0,
            },
            "& span": { marginRight: "4px", color: theme.normal.text2 },
          })}
        >
          <Box component={"p"}>
            <span>TP</span>
            {tp}USDT
          </Box>
          <Box component={"p"}>
            <span>SL</span>
            {sl}USDT
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack direction={"row"} justifyContent={"flex-end"} spacing={"8px"}>
          <MainButton
            title={"Add"}
            onClick={() =>
              props.buttonCallBack({
                data: props.data,
                type: FuturesModalType.add,
              })
            }
            style={{ height: "36px", width: "65px", fontSize: 12 }}
          />
          <MainButton
            title={showTriggerTitle}
            onClick={() =>
              props.buttonCallBack({
                data: props.data,
                type: FuturesModalType.trigger,
              })
            }
            style={{ height: "36px", width: "65px", fontSize: 12 }}
          />
          <MainButton
            title={"Close"}
            onClick={() =>
              props.buttonCallBack({
                data: props.data,
                type: FuturesModalType.close,
              })
            }
            style={{ height: "36px", width: "65px", fontSize: 12 }}
          />
          <FuturesOrderShare
            component={"button"}
            onClick={() => setShowShareOrderModal(true)}
          >
            <Share />
          </FuturesOrderShare>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default POrderTable;

interface POrderTableRowCloseProps {
  data: FuturesOrderV2;
  price: FuturesPrice | undefined;
  hideOrder: (orderIndex: BigNumber, hash: string) => void;
}
const POrderTableCloseRow: FC<POrderTableRowCloseProps> = ({ ...props }) => {
  const {
    tokenName,
    isLong,
    lever,
    showBasePrice,
    tp,
    sl,
    showLiqPrice,
    showMarginAssets,
    showPercent,
    isRed,
    showTitle,
    showShareOrderModal,
    setShowShareOrderModal,
    shareOrder,
  } = useFuturesPOrderClose(props.data, props.price);
  return (
    <TableRow sx={(theme) => ({ "&: hover": { background: theme.normal.bg1 } })}>
      <ShareMyOrderModal
        value={shareOrder}
        open={showShareOrderModal}
        onClose={() => {
          setShowShareOrderModal(false);
        }}
      />
      <TableCell>
        <OrderTablePosition
          tokenName={tokenName}
          isLong={isLong}
          lever={lever}
        />
      </TableCell>
      <TableCell sx={tdNoPadding}>
        <Stack
          direction={"row"}
          spacing={"4px"}
          alignItems={"flex-end"}
          sx={(theme) => ({
            "& p": {
              fontWeight: 700,
              fontSize: 14,
              color: theme.normal.text0,
            },
            "& span": {
              fontWeight: 400,
              fontSize: 10,
              color: isRed ? theme.normal.danger : theme.normal.success,
            },
          })}
        >
          <p>{showMarginAssets}NEST</p>
          <span>{showPercent}%</span>
        </Stack>
      </TableCell>
      <TableCell sx={tdNoPadding}>
        <Box
          component={"p"}
          sx={(theme) => ({
            fontWeight: 700,
            fontSize: 14,
            color: theme.normal.text0,
          })}
        >
          {showBasePrice}USDT
        </Box>
      </TableCell>
      <TableCell sx={tdNoPadding}>
        <Box
          component={"p"}
          sx={(theme) => ({
            fontWeight: 700,
            fontSize: 14,
            color: theme.normal.text0,
          })}
        >
          {showLiqPrice}USDT
        </Box>
      </TableCell>
      <TableCell sx={tdNoPadding}>
        <Stack
          spacing={"4px"}
          sx={(theme) => ({
            "& p": {
              fontSize: 12,
              fontWeight: 400,
              color: theme.normal.text0,
            },
            "& span": { marginRight: "4px", color: theme.normal.text2 },
          })}
        >
          <Box component={"p"}>
            <span>TP</span>
            {tp}USDT
          </Box>
          <Box component={"p"}>
            <span>SL</span>
            {sl}USDT
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack direction={"row"} justifyContent={"flex-end"} spacing={"8px"}>
          <Stack
            direction={"row"}
            spacing={"8px"}
            alignItems={"center"}
            component={"button"}
            onClick={() =>
              props.hideOrder(props.data.index, props.data.closeHash ?? "")
            }
            sx={(theme) => ({
              border: `1px solid ${theme.normal.primary_light_active}`,
              borderRadius: "8px",
              height: "36px",
              paddingX: "12px",
              fontWeight: 700,
              fontSize: "12px",
              color: theme.normal.primary,
              "& svg": {
                width: "14px",
                height: "14px",
                display: "block",
                "& path": {
                  fill: theme.normal.primary,
                },
              },
              "&:hover": {
                cursor: "pointer",
                color: theme.normal.highDark,
                background: theme.normal.primary_hover,
                "& svg path": {
                  fill: theme.normal.highDark,
                },
              },
              "&:active": {
                color: theme.normal.highDark,
                background: theme.normal.primary_active,
                "& svg path": {
                  fill: theme.normal.highDark,
                },
              },
            })}
          >
            <p>{showTitle}</p>
            <Close />
          </Stack>
          <FuturesOrderShare
            component={"button"}
            onClick={() => setShowShareOrderModal(true)}
          >
            <Share />
          </FuturesOrderShare>
        </Stack>
      </TableCell>
    </TableRow>
  );
};
