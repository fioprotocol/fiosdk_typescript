export type MockRegisterFioNameRequestProps = {
    fioName: string;
    publicKey: string;
    baseUrl: string;
};
export type MockRegisterFioNameRequestData = {
    fio_name: string;
    owner_fio_public_key: string;
};
export declare class MockRegisterFioName {
    props: MockRegisterFioNameRequestProps;
    ENDPOINT: string;
    constructor(props: MockRegisterFioNameRequestProps);
    execute(): Promise<any>;
}
//# sourceMappingURL=MockRegisterFioName.d.ts.map