import { IIdDomainEntity } from "../../base/dto/domain/IIdDomainEntity";

export interface IGame extends IIdDomainEntity {
    id: string;
    idgbId: string;
    name: string;
    boxArtUrl: string | null;
    eTag: string | null;
    lastFetched: Date;
    lastSuccessfulFetch: Date | null;
}