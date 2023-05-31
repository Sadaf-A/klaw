import { cleanup, screen } from "@testing-library/react";
import { customRender } from "src/services/test-utils/render-with-wrappers";
import { TopicDetails } from "src/app/features/topics/details/TopicDetails";
import { getTopicOverview } from "src/domain/topic/topic-api";
import { TopicOverview } from "src/domain/topic";
import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/react/pure";

const mockUseParams = jest.fn();
const mockMatches = jest.fn();
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => mockUseParams(),
  useMatches: () => mockMatches(),
  Navigate: () => mockedNavigate(),
}));

jest.mock("src/domain/topic/topic-api");

const mockGetTopicOverview = getTopicOverview as jest.MockedFunction<
  typeof getTopicOverview
>;

const testTopicName = "my-nice-topic";
const testTopicOverview: TopicOverview = {
  topicExists: true,
  schemaExists: false,
  prefixAclsExists: false,
  txnAclsExists: false,
  topicInfoList: [
    {
      topicName: testTopicName,
      noOfPartitions: 1,
      noOfReplicas: "1",
      teamname: "Ospo",
      teamId: 0,
      envId: "1",
      showEditTopic: true,
      showDeleteTopic: false,
      topicDeletable: false,
      envName: "DEV",
    },
  ],
  aclInfoList: [
    {
      req_no: "1006",
      acl_ssl: "aivtopic3user",
      topicname: "aivtopic3",
      topictype: "Producer",
      consumergroup: "-na-",
      environment: "1",
      environmentName: "DEV",
      teamname: "Ospo",
      teamid: 0,
      aclPatternType: "LITERAL",
      showDeleteAcl: true,
      kafkaFlavorType: "AIVEN_FOR_APACHE_KAFKA",
    },
    {
      req_no: "1011",
      acl_ssl: "declineme",
      topicname: "aivtopic3",
      topictype: "Producer",
      consumergroup: "-na-",
      environment: "1",
      environmentName: "DEV",
      teamname: "Ospo",
      teamid: 0,
      aclPatternType: "LITERAL",
      showDeleteAcl: true,
      kafkaFlavorType: "AIVEN_FOR_APACHE_KAFKA",
    },
    {
      req_no: "1060",
      acl_ssl: "amathieu",
      topicname: "aivtopic3",
      topictype: "Producer",
      consumergroup: "-na-",
      environment: "1",
      environmentName: "DEV",
      teamname: "Ospo",
      teamid: 0,
      aclPatternType: "LITERAL",
      showDeleteAcl: true,
      kafkaFlavorType: "AIVEN_FOR_APACHE_KAFKA",
    },
  ],
  topicHistoryList: [
    {
      environmentName: "DEV",
      teamName: "Ospo",
      requestedBy: "muralibasani",
      requestedTime: "2022-Nov-04 14:41:18",
      approvedBy: "josepprat",
      approvedTime: "2022-Nov-04 14:48:38",
      remarks: "Create",
    },
  ],
  topicPromotionDetails: {
    topicName: "aivtopic3",
    status: "NO_PROMOTION",
  },
  availableEnvironments: [
    {
      id: "1",
      name: "DEV",
    },
    {
      id: "2",
      name: "TST",
    },
  ],
  topicIdForDocumentation: 1015,
};
describe("TopicDetails", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockGetTopicOverview.mockResolvedValue(testTopicOverview);
    mockUseParams.mockReturnValue({
      topicName: testTopicName,
    });

    mockedNavigate.mockImplementation(() => {
      return <div data-testid={"react-router-navigate"} />;
    });
  });

  describe("fetches the topic overview based on topic name", () => {
    beforeEach(() => {
      mockMatches.mockImplementation(() => [
        {
          id: "TOPIC_OVERVIEW_TAB_ENUM_overview",
        },
      ]);

      customRender(<TopicDetails topicName={testTopicName} />, {
        memoryRouter: true,
        queryClient: true,
      });
    });

    afterEach(() => {
      cleanup();
      jest.resetAllMocks();
    });

    it("fetches the data when user goes on page", () => {
      expect(mockGetTopicOverview).toHaveBeenCalledWith({
        topicName: testTopicName,
        environmentId: undefined,
      });
    });

    it("fetches the data anew when user changes environment", async () => {
      const select = await screen.findByRole("combobox", {
        name: "Select environment",
      });

      await user.selectOptions(
        select,
        testTopicOverview.availableEnvironments[1].name
      );

      expect(mockGetTopicOverview).toHaveBeenNthCalledWith(2, {
        topicName: testTopicName,
        environmentId: testTopicOverview.availableEnvironments[1].id,
      });
    });
  });

  describe("renders the correct tab navigation based on router match", () => {
    afterEach(cleanup);

    it("shows the tablist with Overview as currently active panel", () => {
      mockMatches.mockImplementationOnce(() => [
        {
          id: "TOPIC_OVERVIEW_TAB_ENUM_overview",
        },
      ]);

      customRender(<TopicDetails topicName={testTopicName} />, {
        memoryRouter: true,
        queryClient: true,
      });

      const tabList = screen.getByRole("tablist");
      const activeTab = within(tabList).getByRole("tab", { selected: true });

      expect(tabList).toBeVisible();
      expect(activeTab).toHaveAccessibleName("Overview");
    });

    it("shows the tablist with History as currently active panel", () => {
      mockMatches.mockImplementationOnce(() => [
        {
          id: "TOPIC_OVERVIEW_TAB_ENUM_history",
        },
      ]);

      customRender(<TopicDetails topicName={testTopicName} />, {
        memoryRouter: true,
        queryClient: true,
      });

      const tabList = screen.getByRole("tablist");
      const activeTab = within(tabList).getByRole("tab", { selected: true });

      expect(tabList).toBeVisible();
      expect(activeTab).toHaveAccessibleName("History");
    });
  });

  describe("only renders header and tablist if route is matching defined tabs", () => {
    afterEach(cleanup);

    it("does render content if the route matches an existing tab", () => {
      mockMatches.mockImplementation(() => [
        {
          id: "TOPIC_OVERVIEW_TAB_ENUM_overview",
        },
      ]);

      customRender(<TopicDetails topicName={testTopicName} />, {
        memoryRouter: true,
        queryClient: true,
      });

      const tabList = screen.getByRole("tablist");

      expect(tabList).toBeVisible();
      expect(mockedNavigate).not.toHaveBeenCalled();
    });

    it("redirects user to topic overview if the route does not matches an existing tab", () => {
      mockMatches.mockImplementation(() => [
        {
          id: "something",
        },
      ]);

      customRender(<TopicDetails topicName={testTopicName} />, {
        memoryRouter: true,
        queryClient: true,
      });

      const tabList = screen.queryByRole("tablist");

      expect(tabList).not.toBeInTheDocument();

      expect(mockedNavigate).toHaveBeenCalled();
    });
  });
});
