package ug.co.sampletracker.app.models.requests;

/**
 * Created by Timothy Kasaga for Leontymo Developers on 10/24/2018.
 */
public class TonnageReportReq {

    private String customerRef = "";
    private String startDate = "";
    private String endDate = "";

    public String getCustomerRef() {
        return customerRef;
    }

    public void setCustomerRef(String customerRef) {
        this.customerRef = customerRef;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
}
