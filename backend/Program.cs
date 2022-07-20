var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => {
  options.AddPolicy("Default", cors => {
    cors.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
  });
});

var app = builder.Build();
app.UseCors("Default");

var items = new List<Item> {
  new Item {
    Id = 1,
    Name = "Default Item"
  }
};

app.MapGet("/items", () => items);

app.MapPost("/items", (Item request) =>
{
  var newItem = new Item
  {
    Id = items.Max(x => x.Id) + 1,
    Name = request.Name
  };

  items.Add(newItem);

  return newItem;
});

app.MapGet("/items/{itemId}", (int itemId) => {
  var item = items.Find(x => x.Id == itemId);

  if(item == null) {
    return Results.NotFound();
  }

  return Results.Ok(item);
});

app.MapPut("/items/{itemId}", (int itemId, Item request) => {
  var item = items.Find(x => x.Id == itemId);

  if(item == null) {
    return Results.NotFound();
  }

  item.Name = request.Name;

  return Results.Ok(item);
});

app.MapDelete("/items/{itemId}", (int itemId) => {
  var item = items.Find(x => x.Id == itemId);

  if(item == null) {
    return Results.NotFound();
  }

  items.Remove(item);

  return Results.Ok();
});

app.Run();
