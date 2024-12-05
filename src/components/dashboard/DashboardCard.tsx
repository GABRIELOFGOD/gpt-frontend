import { MdDashboard } from 'react-icons/md'
import { IDashboard } from '../../utils/contants'

export const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const DashboardCard = ({ name, value, isMoney, icon }: IDashboard) => {
  return (
    <div className={`w-full md:w-[300px] bg-white rounded-md p-3`}>
      <div className="rounded-full h-10 w-10">
        {icon ? icon : <MdDashboard className="text-xl text-primary" />}
      </div>
      <p className="font-semibold text-lg text-neutral-900">{name}</p>
      <div className="flex font-bold">
        {isMoney && <p className='text-sm text-neutral-600'>$</p>}
        <p className='text-sm text-neutral-600'>{formatNumber(value)}</p>
      </div>
    </div>
  )
}

export default DashboardCard