import { useCallback, useEffect, useMemo, useState } from "react";
import { FuturesOrderV2 } from "./useFuturesOrderList";
import { BigNumber } from "ethers";
import { BASE_NEST_FEE, lipPrice } from "./useFuturesNewOrder";
import { useUpdateStopPrice } from "../contracts/useFuturesBuyV2";
import { FuturesPrice, priceToken } from "../pages/Futures/Futures";
import {
  TransactionType,
  usePendingTransactions,
} from "./useTransactionReceipt";

function useFuturesEditPosition(
  data: FuturesOrderV2,
  price: FuturesPrice | undefined,
  onClose: () => void
) {
  const { isPendingOrder } = usePendingTransactions();
  const [send, setSend] = useState(false);
  /**
   * futures modal
   */
  const checkShowTriggerNotice = useMemo(() => {
    const isShow = localStorage.getItem("TriggerRiskModal");
    return isShow === "1" ? false : true;
  }, []);
  const [showTriggerNotice, setShowTriggerNotice] = useState(false);
  const [showedTriggerNotice, setShowedTriggerNotice] = useState(false);

  const defaultTP = useMemo(() => {
    if (!BigNumber.from("0").eq(data.stopProfitPrice)) {
      const p = data.stopProfitPrice.bigNumberToShowString(18, 2);
      return p ?? "";
    }
    return "";
  }, [data.stopProfitPrice]);
  const defaultSL = useMemo(() => {
    if (!BigNumber.from("0").eq(data.stopLossPrice)) {
      const p = data.stopLossPrice.bigNumberToShowString(18, 2);
      return p ?? "";
    }
    return "";
  }, [data.stopLossPrice]);
  const [stopProfitPriceInput, setStopProfitPriceInput] =
    useState<string>(defaultTP);
  const [stopLossPriceInput, setStopLossPriceInput] =
    useState<string>(defaultSL);
  const isEditTP = useMemo(() => {
    if (stopProfitPriceInput !== "") {
      return true;
    }
    return false;
  }, [stopProfitPriceInput]);
  const isEditSL = useMemo(() => {
    if (stopLossPriceInput !== "") {
      return true;
    }
    return false;
  }, [stopLossPriceInput]);
  const isEdit = useMemo(() => {
    return !(
      BigNumber.from("0").eq(data.stopProfitPrice) &&
      BigNumber.from("0").eq(data.stopLossPrice)
    );
  }, [data.stopLossPrice, data.stopProfitPrice]);

  /**
   * action
   */
  const { transaction: edit } = useUpdateStopPrice(
    data.index,
    stopProfitPriceInput.stringToBigNumber(18) ?? BigNumber.from("0"),
    stopLossPriceInput.stringToBigNumber(18) ?? BigNumber.from("0")
  );
  /**
   * show
   */
  const placeHolder = useMemo(() => {
    if (price) {
      const nowPrice = price[
        priceToken[parseInt(data.channelIndex.toString())]
      ].bigNumberToShowString(18, 2);
      return [`>${nowPrice}`, `<${nowPrice}`];
    }
    return ["", ""];
  }, [data.channelIndex, price]);
  const showPosition = useMemo(() => {
    const lever = data.lever.toString();
    const longOrShort = data.orientation ? "Long" : "Short";
    const balance = BigNumber.from(
      data.balance.toString()
    ).bigNumberToShowString(4, 2);
    return `${lever}X ${longOrShort} ${balance} NEST`;
  }, [data.balance, data.lever, data.orientation]);
  const showOpenPrice = useMemo(() => {
    return `${BigNumber.from(data.basePrice.toString()).bigNumberToShowString(
      18,
      2
    )} USDT`;
  }, [data.basePrice]);
  const showLiqPrice = useMemo(() => {
    const result = lipPrice(
      data.balance,
      data.appends,
      data.lever,
      price
        ? price[priceToken[parseInt(data.channelIndex.toString())]]
        : data.basePrice,
      data.basePrice,
      data.orientation
    );
    return result.bigNumberToShowString(18, 2);
  }, [
    data.balance,
    data.appends,
    data.lever,
    data.channelIndex,
    data.basePrice,
    data.orientation,
    price,
  ]);
  const showTriggerFee = useMemo(() => {
    const fee = BigNumber.from("5")
      .mul(data.lever)
      .mul(data.balance)
      .div(BigNumber.from("10000"))
      .add(BASE_NEST_FEE.stringToBigNumber(4)!);
    return BigNumber.from(fee.toString()).bigNumberToShowString(4, 2);
  }, [data.balance, data.lever]);
  const feeTip = useMemo(() => {
    return [
      "Position fee =Position*0.05%",
      "Stop order fee(after execution) = 15 NEST",
    ];
  }, []);
  /**
   * main button
   */
  const pending = useMemo(() => {
    return isPendingOrder(
      TransactionType.futures_editPosition,
      parseInt(data.index.toString())
    );
  }, [data.index, isPendingOrder]);
  useEffect(() => {
    if (send && !pending) {
      onClose();
    } else if (!send && pending) {
      setSend(true);
    }
  }, [onClose, pending, send]);
  const mainButtonTitle = useMemo(() => {
    return "Confirm";
  }, []);
  const mainButtonLoading = useMemo(() => {
    if (edit.isLoading || pending) {
      return true;
    } else {
      return false;
    }
  }, [edit.isLoading, pending]);
  const mainButtonDis = useMemo(() => {
    if (stopProfitPriceInput === "" && stopLossPriceInput === "") {
      return true;
    }
    return false;
  }, [stopLossPriceInput, stopProfitPriceInput]);
  const triggerNoticeCallback = useCallback(() => {
    setShowedTriggerNotice(true);
    edit.write?.();
  }, [edit]);
  const mainButtonAction = useCallback(() => {
    if (mainButtonLoading) {
      return;
    } else {
      if (checkShowTriggerNotice && !showedTriggerNotice) {
        setShowTriggerNotice(true);
        return;
      }
      edit.write?.();
    }
  }, [checkShowTriggerNotice, edit, mainButtonLoading, showedTriggerNotice]);
  const closeTP = useCallback(() => {
    setStopProfitPriceInput("0");
  }, []);
  const closeSL = useCallback(() => {
    setStopLossPriceInput("0");
  }, []);
  return {
    stopProfitPriceInput,
    setStopProfitPriceInput,
    stopLossPriceInput,
    setStopLossPriceInput,
    showPosition,
    showOpenPrice,
    showLiqPrice,
    showTriggerFee,
    mainButtonTitle,
    mainButtonLoading,
    mainButtonDis,
    mainButtonAction,
    placeHolder,
    isEditTP,
    isEditSL,
    isEdit,
    closeTP,
    closeSL,
    feeTip,
    showTriggerNotice,
    setShowTriggerNotice,
    triggerNoticeCallback,
  };
}

export default useFuturesEditPosition;
