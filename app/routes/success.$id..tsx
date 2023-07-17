import { LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";


export async function loader(params: LoaderArgs) {
    const license = params.params.id;

    const cookieHeader = params.request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);

    const data = await ApiCall({
        query: `
            query getAllLicenseById($id:Int!){
                getAllLicenseById(id:$id){
                    id,
                    licenseType,
                    name,
                    paymentAmount,
                    discountAmount,
                    questionAllowed,
                    projectPerLicense,
                    discountValidTill
                },
            }
        `,
        veriables: {
            id: parseInt(license!)
        },
        headers: { authorization: `Bearer ${cookie.token}` },
    });
    var date = new Date();
    date.setDate(date.getDate() + 30);
    const licenase = await ApiCall({
        query: `
        mutation createLicenseSlave($createLicenseslaveInput:CreateLicenseslaveInput!){
            createLicenseSlave(createLicenseslaveInput:$createLicenseslaveInput){
                id,
            }
          }
        `,
        veriables: {
            "createLicenseslaveInput": {
                "licenseTypeId": data.data.getAllLicenseById.id,
                "paymentStatus": "ACTIVE",
                "licenseValidity": date,
                "userId": Number(cookie.id),
                "paymentReference": "SoMe_RaNdOm",
                "paymentAmount": data.data.getAllLicenseById.paymentAmount,
                "status": "ACTIVE"
            }
        },
        headers: { authorization: `Bearer ${cookie.token}` },
    });
    return ({ data: licenase });
}
const Cencel: React.FC = (): JSX.Element => {
    const license = useLoaderData().data;
    return (
        <div className="bg-[#eeeeee] h-screen w-full grid place-items-center">
            {license.status ?
                <div className="w-80 bg-white rounded-md shadow-md p-6">
                    <h1 className="text-green-500  text-xl font-semibold">SUCCESS</h1>
                    <h1 className="my-4 text-green-500 bg-green-500 bg-opacity-10 rounded-md border-l-2 border-green-500 p-2">Payment not completed Somethign went wrong. Try Again!</h1>
                    <Link to={"/home"} className="py-2 rounded-md shadow-md bg-green-500 text-white font-semibold px-4">Go Back Home</Link>
                </div> :
                <div className="w-80 bg-white rounded-md shadow-md p-6">
                    <h1 className="text-rose-500  text-xl font-semibold">Error</h1>
                    <h1 className="my-4 text-rose-500 bg-rose-500 bg-opacity-10 rounded-md border-l-2 border-rose-500 p-2">Payment not completed Somethign went wrong. Try Again!</h1>
                    <Link to={"/home"} className="py-2 rounded-md shadow-md bg-rose-500 text-white font-semibold px-4">Go Back Home</Link>
                </div>

            }
        </div>
    )
}

export default Cencel;