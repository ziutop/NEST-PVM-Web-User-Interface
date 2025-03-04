import { BigNumber } from "ethers";
import { useMemo, useState } from "react";
import { Order } from "../pages/Dashboard/Dashboard";
import { FuturesPrice, priceToken } from "../pages/Futures/Futures";
import { lipPrice } from "./useFuturesNewOrder";
import { FuturesOrderV2 } from "./useFuturesOrderList";

function useFuturesPOrderClose(
  data: FuturesOrderV2,
  price: FuturesPrice | undefined
) {
  const tokenName = priceToken[parseInt(data.channelIndex.toString())];
  const isLong = data.orientation;
  const lever = parseInt(data.lever.toString());
  const [showShareOrderModal, setShowShareOrderModal] =
    useState<boolean>(false);

  const marginAssets = useMemo(() => {
    return data.actualMargin.stringToBigNumber(18);
  }, [data.actualMargin]);
  const showBasePrice = BigNumber.from(
    data.basePrice.toString()
  ).bigNumberToShowString(18, 2);
  const tp = useMemo(() => {
    const tpNum = data.stopProfitPrice;
    return BigNumber.from("0").eq(tpNum)
      ? String().placeHolder
      : BigNumber.from(tpNum.toString()).bigNumberToShowString(18, 2);
  }, [data.stopProfitPrice]);
  const sl = useMemo(() => {
    const slNum = data.stopLossPrice;
    return BigNumber.from("0").eq(slNum)
      ? String().placeHolder
      : BigNumber.from(slNum.toString()).bigNumberToShowString(18, 2);
  }, [data.stopLossPrice]);
  const showLiqPrice = useMemo(() => {
    const result = lipPrice(
      data.balance,
      data.appends,
      data.lever,
      data.basePrice,
      data.basePrice,
      data.orientation
    );
    return result.bigNumberToShowString(18, 2);
  }, [
    data.appends,
    data.balance,
    data.basePrice,
    data.lever,
    data.orientation,
  ]);
  const showMarginAssets = useMemo(() => {
    if (marginAssets) {
      return BigNumber.from(marginAssets.toString()).bigNumberToShowString(
        18,
        2
      );
    } else {
      return String().placeHolder;
    }
  }, [marginAssets]);
  const showPercentNum = useMemo(() => {
    if (marginAssets) {
      const marginAssets_num = parseFloat(
        marginAssets.bigNumberToShowString(18, 2)
      );
      const balance_num = parseFloat(
        BigNumber.from(data.balance.toString())
          .add(data.appends)
          .bigNumberToShowString(4, 2)
      );
      if (marginAssets_num >= balance_num) {
        return parseFloat(
          (((marginAssets_num - balance_num) * 100) / balance_num).toFixed(2)
        );
      } else {
        return -parseFloat(
          (((balance_num - marginAssets_num) * 100) / balance_num).toFixed(2)
        );
      }
    } else {
      return 0;
    }
  }, [data.appends, data.balance, marginAssets]);
  const showPercent = useMemo(() => {
    if (showPercentNum > 0) {
      return `+${showPercentNum}`;
    } else if (showPercentNum < 0) {
      return `${showPercentNum}`;
    } else {
      return "0";
    }
  }, [showPercentNum]);
  const isRed = useMemo(() => {
    return showPercent.indexOf("-") === 0;
  }, [showPercent]);
  const showTitle = useMemo(() => {
    return data.baseBlock.toString() === "0"
      ? "Liquidated"
      : "Trigger executed";
  }, [data.baseBlock]);
  const shareOrder = useMemo(() => {
    const info: Order = {
      owner: data.owner.toString(),
      leverage: `${data.lever.toString()}X`,
      orientation: data.orientation ? "Long" : "Short",
      actualRate: showPercentNum,
      index: parseInt(data.index.toString()),
      openPrice: parseFloat(data.basePrice.bigNumberToShowString(18, 2)),
      tokenPair: `${tokenName}/USDT`,
      actualMargin: marginAssets
        ? parseFloat(marginAssets.bigNumberToShowString(18, 2))
        : 0,
      initialMargin: parseFloat(
        BigNumber.from(data.balance.toString()).bigNumberToShowString(4, 2)
      ),
      lastPrice: parseFloat(
        price ? price[tokenName].bigNumberToShowString(18, 2) : "0"
      ),
      sp: parseFloat(tp === String().placeHolder ? "0" : tp),
      sl: parseFloat(sl === String().placeHolder ? "0" : sl),
    };
    return info;
  }, [
    data.balance,
    data.basePrice,
    data.index,
    data.lever,
    data.orientation,
    data.owner,
    marginAssets,
    price,
    showPercentNum,
    sl,
    tokenName,
    tp,
  ]);
  return {
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
  };
}

export default useFuturesPOrderClose;
