import React, { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "shards-react";
import { Container } from "react-bootstrap";

import LeaderBoard from "./LeaderBoard";
import {
  getLeaderBoardData,
  getDropdownListItems,
  getStatusListItems
} from "../../utils/dashboardDataUtils";
import "./LeaderBoardContainer.css";

const LeaderBoardContainer = props => {
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);
  const [leaderBoardData, setLeaderBoardData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState({});
  const [dropdownListItems, setDropdownListItems] = useState([]);
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false);
  const [statusListItems, setStatusListItems] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});

  useEffect(() => {
    const dropdownItems = getDropdownListItems() || [];
    setDropdownListItems(dropdownItems);
    setSelectedCategory(dropdownItems[0] || {});
  }, []);

  useEffect(() => {
    const statusItems = getStatusListItems() || [];
    setStatusListItems(statusItems);
    setSelectedStatus(statusItems[0] || {});
  }, []);

  useEffect(() => {
    const leaderBoardData = getLeaderBoardData(
      props.roleStatsData,
      selectedCategory.id
    );
    setLeaderBoardData(leaderBoardData);
  }, [props.roleStatsData, selectedCategory]);

  return (
    <Container className="leaderboard-container">
      <section className="leaderboard-head-container">
        <h4 className="leaderboard-title">Processing Leaderboard</h4>
        <div>
          <Dropdown
            open={openCategoryDropdown}
            toggle={() => {
              setOpenCategoryDropdown(!openCategoryDropdown);
            }}
          >
            <DropdownToggle theme="success" caret>
              {selectedCategory.name}
            </DropdownToggle>
            <DropdownMenu>
              {dropdownListItems.map(item => (
                <DropdownItem
                  key={item.id}
                  onClick={() => setSelectedCategory(item)}
                >
                  {item.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="leaderboard-status-container">
          <span>Status</span>
          <Dropdown
            open={openStatusDropdown}
            toggle={() => {
              setOpenStatusDropdown(!openStatusDropdown);
            }}
          >
            <DropdownToggle theme="success" caret>
              {selectedStatus.name}
            </DropdownToggle>
            <DropdownMenu>
              {statusListItems.map(item => (
                <DropdownItem
                  key={item.id}
                  onClick={() => setSelectedStatus(item)}
                >
                  {item.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </section>
      <LeaderBoard
        leaderBoardData={leaderBoardData}
        selectedStatus={selectedStatus}
        selectedCategory={selectedCategory}
      />
    </Container>
  );
};

export default LeaderBoardContainer;
