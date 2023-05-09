import { IIdDomainEntity } from "../../base/dto/domain/IIdDomainEntity";

export interface IGame extends IIdDomainEntity {
    id: string;
    igdbId: string;
    name: string;
    boxArtUrl: string | null;
    etag: string | null;
    lastFetched: Date;
    lastSuccessfulFetch: Date | null;
}