"use client"
import Pagination from 'react-bootstrap/Pagination';
import Stack from 'react-bootstrap/Stack';
import Image from 'next/image';
import Leftarrow from 'public/images/left_grey_arrow.svg';
import Rightarrow from 'public/images/right_grey_arrow.svg';

const PaginationComponent = (props) => {
  return (
    <>
      <Stack direction="horizontal" gap={0} className='pagination_mainbx justify-content-end'>
        <Pagination className='pagination_arrow'>
          <Pagination.Prev >
            <Image src={Leftarrow} alt='leftarrow' width={8} />
          </Pagination.Prev >
        </Pagination>
        <Pagination className='pagination_count'>
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Item >{2}</Pagination.Item>
          <Pagination.Item >{3}</Pagination.Item>
          <Pagination.Item >{4}</Pagination.Item>
        </Pagination>
        <Pagination className='pagination_arrow'>
          <Pagination.Next>
            <Image src={Rightarrow} alt='rightarrow' width={8} />
          </Pagination.Next >
        </Pagination>
      </Stack>
    </>
  );
}

export default PaginationComponent;