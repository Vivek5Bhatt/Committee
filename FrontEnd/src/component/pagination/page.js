"use client"
import Image from 'next/image';
import Leftarrow from 'public/images/left_grey_arrow.svg';
import Rightarrow from 'public/images/right_grey_arrow.svg';

const Pagination = (props) => {
    const { nPages, currentPage, setCurrentPage } = props

    const pageNumbers = nPages ? [...Array(nPages + 1).keys()].slice(1) : []

    const nextPage = () => {
        if (currentPage !== nPages)
            setCurrentPage(currentPage + 1)
    }

    const prevPage = () => {
        if (currentPage !== 1)
            setCurrentPage(currentPage - 1)
    }

    return (
        <nav className="pagination_mainbx d-flex align-items-center justify-content-end">
            <ul className="pagination_arrow">
                <li className='page-item'>
                    <a className='page-link' onClick={prevPage} href='#'>
                        <Image src={Leftarrow} alt='leftarrow' width={8} />
                    </a>
                </li>
            </ul>
            <ul className='pagination pagination_count justify-content-center'>
                {
                    pageNumbers?.map(pgNumber => {
                        return (
                            <>
                                {currentPage == pgNumber ?
                                    <>
                                        <li key={pgNumber}
                                            className={`page-item ${currentPage == pgNumber ? "active" : ""}`}>
                                            <a onClick={() => setCurrentPage(pgNumber)}
                                                className='page-link'
                                                href='#'
                                            >
                                                {pgNumber}
                                            </a>
                                        </li>
                                        {currentPage !== pageNumbers.length ?
                                            <>
                                                {(pageNumbers.length > 2 && pageNumbers.length - 1 !== currentPage) && <li>...</li>}
                                                <li key={pgNumber}
                                                    className={`page-item ${currentPage == pageNumbers.length ? "active" : ""}`}>
                                                    <a onClick={() => setCurrentPage(pageNumbers.length)}
                                                        className='page-link'
                                                        href='#'
                                                    >
                                                        {pageNumbers.length}
                                                    </a>
                                                </li>
                                            </> : null}
                                    </> : null}
                            </>
                        )
                    })
                }
            </ul>
            <ul className="pagination_arrow">
                <li className='page-item'>
                    <a className='page-link' onClick={nextPage} href='#'>
                        <Image src={Rightarrow} alt='rightarrow' width={8} />
                    </a>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination;