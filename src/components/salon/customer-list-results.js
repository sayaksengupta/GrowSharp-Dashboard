import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import Axios from 'axios';
import { useEffect } from 'react';


export const CustomerListResults = ({ customers, ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [students, setStudents] = useState([]);

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = customers.map((customer) => customer.id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const fetchStudents = async () => {
    await Axios.get("http://localhost:8000/student/get-all-students")
    .then((res) => {
      console.log(res);
      setStudents(res.data.AllStudents);
    }).catch((e) => {
      console.log(e);
    }) 
  }

  const deleteStudent = async (id) => {
    await Axios.delete(`http://localhost:8000/student/remove-student/${id}`)
    .then((res) => {
      console.log(res);
      setCallApi(!callApi);
    }).catch((e) => {
      console.log(e);
    })
  }
  
  useEffect(() => {
      fetchStudents();
  }, [])

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === customers.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0
                      && selectedCustomerIds.length < customers.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                   Name
                </TableCell>
                <TableCell>
                  Mobile
                </TableCell>
                <TableCell>
                  Board
                </TableCell>
                <TableCell>
                  School
                </TableCell>
                <TableCell>
                  Grade
                </TableCell>
                <TableCell width={120}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.slice(0, limit).map((customer) => (
                <TableRow
                  hover
                  key={customer.id}
                  selected={selectedCustomerIds.indexOf(customer._id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(customer._id) !== -1}
                      onChange={(event) => handleSelectOne(event, customer._id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        src={customer.profileImg}
                        sx={{ mr: 2 }}
                      >
                        {getInitials(`${customer.first_name}${customer.last_name}`)}
                      </Avatar>
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {customer.first_name}{customer.last_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {customer.mobile}
                  </TableCell>
                  <TableCell>
                    {`${customer.board}`}
                  </TableCell>
                  <TableCell>
                    {customer.school}
                  </TableCell>
                  <TableCell>
                    {customer.grade}
                  </TableCell>
                  {/* <TableCell>
                    {customer.services.map((service,index) => {
                      if((index === 0 && customer.services.length>1) || index < customer.services.length - 1)
                      return `${service.category_name},`;
                      else if(index === customer.services.length-1){
                        return ` ${service.category_name}.`
                      }
                    })}
                  </TableCell> */}
                   <TableCell sx={{display:"flex", flexDirection:"column"}}>
                    {/* {customer.active === 1?
                    <Button onClick={() => toggleActivity(customer._id,0)}>Active</Button>
                    :
                    <Button onClick={() => toggleActivity(customer._id,1)}>Inactive</Button>
                    } */}
                    <Button>Edit</Button>
                    <Button onClick={() => deleteStudent(customer._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={customers.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

CustomerListResults.propTypes = {
  customers: PropTypes.array.isRequired
};
