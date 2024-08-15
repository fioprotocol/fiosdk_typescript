export type MockRegisterFioNameRequestProps = {
    fioName: string;
    publicKey: string;
    baseUrl: string;
};
export type MockRegisterFioNameRequestData = {
    fio_name: string;
    owner_fio_public_key: string;
};
export declare class MockRegisterFioNameRequest {
    props: MockRegisterFioNameRequestProps;
    ENDPOINT: string;
    ACTION: string;
    ACOUNT: string;
    constructor(props: MockRegisterFioNameRequestProps);
    execute(): Promise<any>;
}
//# sourceMappingURL=MockRegisterFioNameRequest.d.ts.map