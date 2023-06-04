export interface IBaseArchiveEntity {
    lastFetchOfficial: Date | null,
    lastSuccessfulFetchOfficial: Date | null,
    lastFetchUnofficial: Date | null,
    lastSuccessfulFetchUnofficial: Date | null,
    addedToArchiveAt: Date | null,
}