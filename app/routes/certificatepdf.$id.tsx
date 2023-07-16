import { Page, Text, View, Document, StyleSheet, Font, PDFViewer, PDFDownloadLink, renderToFile, usePDF, pdf, Image } from '@react-pdf/renderer';
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from "react";
import { symbol } from 'zod';
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
            }
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
            id: Number(cookie.id)
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
            id: parseInt(data.data.searchResult[0].projectId)
        },
        headers: { authorization: `Bearer ${cookie.token}` },
    });

    return json({
        result: data.data.searchResult,
        token: cookie.token,
        user: user.data.getUserById,
        project: project.data.getAllProjectById
    });
}

const PetroleumPdfView = (): JSX.Element => {

    const loader = useLoaderData();
    const result = loader.result[0];
    const user = loader.user;
    const project = loader.project;

    const groupedData: Array<{ principleid: number, principlename: string, totalMark: number, questions: Array<any> }> = Object.values(result.assesement.result.reduce((result: any, obj: any) => {

        const { principleid, principlename, mark, ...questionData } = obj;
        if (!result[principleid]) {
            result[principleid] = {
                principleid,
                principlename,
                totalMark: 0,
                questions: []
            };
        }
        result[principleid].totalMark += mark;
        result[principleid].questions.push(obj);
        return result;
    }, {}));


    let titles: string[] = [];
    let labels: string[][] = [];
    let mark: number[][] = [];


    groupedData.forEach((val: any, index: number) => {
        titles[index] = val.principlename;
        labels[index] = val.questions.map((val: any) => val.questioncode);
        mark[index] = val.questions.map((val: any) => val.mark);
    });




    Font.register({
        family: 'Oswald',
        src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
    });

    const styles = StyleSheet.create({
        body: {
            paddingTop: 15,
            paddingBottom: 35,
            paddingHorizontal: 35,
        },
        heading: {
            fontSize: 14,
            textAlign: 'center',
            fontFamily: 'Oswald'
        },
        title: {
            marginTop: "10px",
            marginBottom: "10px",
            fontSize: 10,
            textAlign: 'center',
            color: 'grey',
            width: "100%"
        },
        divider: {
            height: "30px"
        },
        dividertwo: {
            height: "25px"
        },
        subtitle: {
            fontSize: 16,
            textAlign: 'left',
            color: 'grey',
            width: "100%"
        },
        header: {
            marginTop: "15px",
            marginBottom: "10px",
            backgroundColor: "#c1dafe",
            paddingVertical: '8px',
            fontSize: "14px",
            color: "#1f2937",
            textAlign: "center",
            fontWeight: "normal"
        },
        myflex: {
            display: "flex",
            flexDirection: "row",
            width: "100%",
            borderBottom: "1px solid #6b7280",
        },

        text: {
            fontSize: "12px",
            fontWeight: 'normal',
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
            fontWeight: 'normal',
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
            fontWeight: 'normal',
            color: "#374151",
            marginTop: "10px"
        },
    });

    const Certificate = () => (
        <Document>
            <Page style={styles.body} size={'A4'} >

                <View style={styles.flexbox}>
                    <View style={styles.flexbox1}>
                    </View>
                    <View style={styles.flexbox2}>
                        <Text style={styles.signtext}>
                            Certificate Id: {result.certificatedId}
                        </Text>

                    </View>
                </View>

                <View>
                    <Text style={styles.heading}>Certificate</Text>
                </View>
                <View>
                    <Text style={styles.title}>Your certificate by smart etitcs</Text>
                </View>
                <View>
                    <Text style={styles.subtitle}>Name: {user.name}</Text>
                </View>
                <View>
                    <Text style={styles.subtitle}>Email: {user.email}</Text>
                </View>
                <View style={styles.divider}></View>
                <View>
                    <Text style={styles.subtitle}>Project Name: {project.name}</Text>
                </View>
                <View>
                    <Text style={styles.subtitle}>Project Description: {project.description}</Text>
                </View>
                <View style={styles.divider}></View>
                {groupedData.map((val: any, index: number) => {
                    return (
                        <>
                            <View>
                                <Text style={styles.subtitle} fixed>
                                    Principle {index + 1}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.subtitle} fixed>
                                    {val.principlename}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.subtitle} fixed>
                                    Mark: {val.totalMark}
                                </Text>
                            </View>
                            <View style={styles.divider}></View>
                        </>
                    );
                })}

                <View style={styles.flexbox}>
                    <View style={styles.flexbox1}>
                        <Text style={styles.signtext}>
                            Total Score: {result.totalScore}
                        </Text>
                    </View>
                    <View style={styles.flexbox2}>
                    </View>
                </View>
            </Page>
        </Document >
    );

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true);
    }, [])


    return (
        <>
            {isClient ?
                < div className='w-full h-scree'>
                    <PDFViewer style={{ width: '100%', height: '100vh' }}>
                        <Certificate />
                    </PDFViewer>
                </div >
                :
                <div className='h-screen w-full grid place-items-center bg-blue-500'>
                    <p className='text-white text-6xl'>Loading...</p>
                </div>}
        </>
    );

}

export default PetroleumPdfView;