document.querySelectorAll("[id=delete]").forEach((element) =>
  element.addEventListener("click", () => {
    if (confirm("Delete your article... Are you sure?")) {
      $.ajax({
        type: "POST",
        url: `/articles/${element.value}?_method=DELETE`,
        success: function (result) {
          location.reload()
        },
      })
    }
  })
)
