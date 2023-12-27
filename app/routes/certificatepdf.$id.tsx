import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";
export async function loader(params: LoaderArgs) {
  const id = params.params.id;
  const cookieHeader = params.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  const data = await ApiCall({
    query: `
      query searchResult($searchResultInput:SearchResultInput!){
        searchResult(searchResultInput:$searchResultInput){
          id,
          certificatedId,
          resultStatus,
          totalScore,
          certified,
          projectId,
          assesement{
            result{
              id,
              principleid,
              principlename,
              question,
              answer,
              mark,
              rec,
              version,
              license,
              questioncode,
              questiontype
            }
          }
        },
      }
    `,
    veriables: {
      searchResultInput: {
        id: parseInt(id!),
      },
    },
    headers: { authorization: `Bearer ${cookie.token}` },
  });

  const user = await ApiCall({
    query: `
          query getUserById($id:Int!){
            getUserById(id:$id){
            id,
            name, 
            companyId, 
            email,
              company{
                id,
                name,
                website,
                email,
                logo,
                ctoContact,
                description,
                address,
                status
              }
            }
          }
          `,
    veriables: {
      id: Number(cookie.id),
    },
    headers: { authorization: `Bearer ${cookie.token}` },
  });

  const project = await ApiCall({
    query: `
        query getAllProjectById($id:Int!){
            getAllProjectById(id:$id){
                id,
                name,
                description
            },
        }
      `,
    veriables: {
      id: parseInt(data.data.searchResult[0].projectId),
    },
    headers: { authorization: `Bearer ${cookie.token}` },
  });

  const license = await ApiCall({
    query: `
        query getUserLicenseSlave($id:Int!){
            getUserLicenseSlave(id:$id){
            licenseTypeId,
            paymentStatus,
            licenseValidity,
            paymentReference,
            paymentAmount,
            createdAt,
                licenseType{
                name,
                paymentAmount,
              licenseType,
              questionAllowed,
              projectPerLicense,
              discountValidTill,          
              }
            }
        }
            `,
    veriables: {
      id: Number(cookie.id),
    },
    headers: { authorization: `Bearer ${cookie.token}` },
  });

  const compliance = await ApiCall({
    query: `
        query getAllCompliance{
          getAllCompliances{
            logo,
          }
        }
          `,
    veriables: {
      id: Number(cookie.id),
    },
    headers: { authorization: `Bearer ${cookie.token}` },
  });

  return json({
    result: data.data.searchResult,
    token: cookie.token,
    user: user.data.getUserById,
    project: project.data.getAllProjectById,
    license: license.data.getUserLicenseSlave,
    compliance: compliance.data.getAllCompliances,
  });
}

const PetroleumPdfView = (): JSX.Element => {
  const loader = useLoaderData();
  const result = loader.result[0];
  const user = loader.user;
  const project = loader.project;
  const license = loader.license;
  const compliance = loader.compliance;

  const groupedData: Array<{
    principleid: number;
    principlename: string;
    totalMark: number;
    questions: Array<any>;
  }> = Object.values(
    result.assesement.result.reduce((result: any, obj: any) => {
      const { principleid, principlename, mark, ...questionData } = obj;
      if (!result[principleid]) {
        result[principleid] = {
          principleid,
          principlename,
          totalMark: 0,
          questions: [],
        };
      }
      result[principleid].totalMark += mark;
      result[principleid].questions.push(obj);
      return result;
    }, {})
  );

  let titles: string[] = [];
  let labels: string[][] = [];
  let mark: number[][] = [];

  groupedData.forEach((val: any, index: number) => {
    titles[index] = val.principlename;
    labels[index] = val.questions.map((val: any) => val.questioncode);
    mark[index] = val.questions.map((val: any) => val.mark);
  });

  Font.register({
    family: "Oswald",
    src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
  });

  const styles = StyleSheet.create({
    body: {
      paddingTop: 15,
      paddingBottom: 35,
      paddingHorizontal: 35,
    },
    heading: {
      fontSize: 16,
      fontFamily: "Oswald",
    },
    title: {
      marginTop: "10px",
      marginBottom: "10px",
      fontSize: 10,
      textAlign: "center",
      color: "grey",
      width: "100%",
    },
    divider: {
      height: "30px",
    },
    dividertwo: {
      height: "25px",
    },
    subtitle: {
      marginTop: "15px",
      marginBottom: "6px",
      fontSize: 16,
      textAlign: "left",
      color: "black",
      width: "100%",
    },
    subtitletwo: {
      fontSize: 14,
      textAlign: "left",
      color: "black",
      width: "100%",
    },
    header: {
      marginTop: "15px",
      marginBottom: "10px",
      backgroundColor: "#c1dafe",
      paddingVertical: "8px",
      fontSize: "14px",
      color: "#1f2937",
      textAlign: "center",
      fontWeight: "normal",
    },
    myflex: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      borderBottom: "1px solid #6b7280",
    },

    text: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      padding: "4px 0px",
    },

    flexbox: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
    },
    flexbox1: {
      flex: 4,
    },
    flexbox2: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      flex: 2,
    },
    img: {
      width: "140px",
      height: "60px",
      objectFit: "fill",
      objectPosition: "center",
    },
    signtext: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      marginTop: "10px",
    },
    footertext: {
      fontSize: "10px",
      fontWeight: "normal",
      color: "#374151",
    },
    bottomimg: {
      width: "80px",
      height: "80px",
      objectFit: "cover",
      objectPosition: "center",
    },
    topimage: {
      width: "100px",
      height: "100px",
      objectFit: "cover",
      objectPosition: "center",
    },
  });

  const Certificate = () => (
    <Document>
      <Page style={styles.body} size={"A4"}>
        <View>
          <Text style={styles.heading}>
            SMART ETHICS - ASSESMENT CERTIFICATE
          </Text>
        </View>
        <View style={styles.flexbox}>
          <View style={styles.flexbox1}></View>
          <View style={styles.flexbox2}>
            <Text style={styles.signtext}>
              Certificate Id: {result.certificatedId}
            </Text>
          </View>
        </View>

        <View style={styles.flexbox}>
          <View style={styles.flexbox1}>
            <View>
              <Text style={styles.subtitletwo}>
                Project Name: {project.name}
              </Text>
            </View>
            <View>
              <Text style={styles.subtitletwo}>
                Company Name: {user.company.name}
              </Text>
            </View>
            <View>
              <Text style={styles.subtitletwo}>Owner Name: {user.name}</Text>
            </View>
            <View>
              <Text style={styles.subtitletwo}>
                Description: {project.description}
              </Text>
            </View>
            <View>
              <Text style={styles.subtitletwo}>
                License Name: {license.licenseType.name}
              </Text>
            </View>
            <View>
              <Text style={styles.subtitletwo}>
                License Type: {license.licenseType.licenseType}
              </Text>
            </View>
            <Text style={styles.subtitle} fixed>
              Overall Score:{" "}
              {(result.totalScore / result.assesement.result.length).toFixed()}
              /10 [{result.resultStatus}]
            </Text>
            {groupedData.map((val: any, index: number) => {
              return (
                <View>
                  <Text style={styles.signtext} fixed>
                    {val.principlename} :{" "}
                    {(val.totalMark / val.questions.length).toFixed(0)}/10
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.flexbox2}>
            <Image src={"/favicon.png"} style={styles.topimage}></Image>
          </View>
        </View>

        <View>
          <Text style={styles.subtitle}>Key Recommendations</Text>
        </View>
        <View>
          <Text style={styles.subtitletwo}>
            {result.assesement.result[0].rec}
          </Text>
        </View>
        <View>
          <Text style={styles.subtitletwo}>
            {result.assesement.result[2].rec}
          </Text>
        </View>
        <View>
          <Text style={styles.subtitletwo}>
            {result.assesement.result[6].rec}
          </Text>
        </View>
        <View>
          <Text style={styles.subtitle}>Aligned Compliances</Text>
        </View>

        <View
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          {compliance.map((val: any, index: number) => {
            return (
              <View>
                <Image src={val.logo} style={styles.bottomimg}></Image>;
              </View>
            );
          })}
        </View>

        <View style={{ height: "30px" }}></View>
        <View>
          <Text style={styles.footertext}>
            Disclaimer: This test result date in prepared based on the online
            assessment test altended by the respective project owner. This
            certificate cannot be used for any other purposes whice is not
            indented or mentioned in the terms and conditions.
          </Text>
        </View>
        <View style={styles.flexbox}>
          <View style={styles.flexbox1}></View>
          <View style={styles.flexbox2}>
            <View style={styles.flexbox}>
              <View style={styles.flexbox1}>
                <Text style={styles.signtext}>Team Smart Ethics</Text>
              </View>
              <View style={styles.flexbox2}>
                <Image src={"/favicon.png"} style={styles.bottomimg}></Image>
              </View>
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.footertext}>
            For any Issues, false claims or disputes get in touch with us to
            report. Contact Us /Feedback (https://smartethics.net/contact)
          </Text>
        </View>
        <View style={{ position: "relative", marginTop: "30px" }}>
          <View
            style={{
              position: "absolute",
              right: "0",
              bottom: "0",
              display: "flex",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: "10px",
                fontWeight: "normal",
                color: "#374151",
                textAlign: "center",
              }}
            >
              Copyright 2023 Smart Ethics. All Rights Reserved
            </Text>
          </View>
          <View style={{ position: "absolute", right: "0", bottom: "0" }}>
            <Text style={styles.footertext}>Terms of Usage</Text>
          </View>
        </View>
      </Page>
    </Document>
  );

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient ? (
        <div className="w-full h-scree">
          <PDFViewer style={{ width: "100%", height: "100vh" }}>
            <Certificate />
          </PDFViewer>
        </div>
      ) : (
        <div className="h-screen w-full grid place-items-center bg-blue-500">
          <p className="text-white text-6xl">Loading...</p>
        </div>
      )}
    </>
  );
};

export default PetroleumPdfView;
