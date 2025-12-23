import  { useState } from 'react'
//type Props = Record<string, never>;
type Props = {
  money: number;
};
const Mago = ({money}:Props) => <p>{money}円</p>

const Kodomo = ({money}:Props) => <Mago money={money} />

const Oya = () => {
  const [money] = useState(10000)
  return (
    <Kodomo money={money} />
  )
}

export default Oya
